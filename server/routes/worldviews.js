const express = require('express');
const { body, validationResult } = require('express-validator');
const { Worldview, User, UserWorldviewLike } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// 获取所有世界观（分页）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const worldview = req.query.worldview;
    const creator = req.query.creator;
    const id = req.query.id;
    const wid = req.query.wid;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    let whereCondition = { isPublic: true };
    let authorIdFilter = null;
    let authorNameFilter = null;
    
    if (category && category !== '全部') {
      whereCondition.category = category;
    }
    
    // 处理不同类型的搜索参数
    if (search) {
      // 检查搜索词是否为数字（可能是世界观编号或作者ID）
      const isNumeric = /^\d+$/.test(search);
      
      if (isNumeric) {
        // 如果是数字，搜索世界观编号和作者ID
        whereCondition[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { tags: { [Op.contains]: [search] } },
          { worldviewNumber: parseInt(search) }
        ];
        
        // 对于作者ID的搜索，我们需要在include中添加条件
        authorIdFilter = parseInt(search);
      } else {
        // 如果不是数字，搜索标题、描述、标签和作者名
        whereCondition[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { tags: { [Op.contains]: [search] } }
        ];
        
        // 对于作者名的搜索，我们需要在include中添加条件
        authorNameFilter = search;
      }
    } else if (worldview) {
      // 搜索世界观标题
      whereCondition.title = { [Op.iLike]: `%${worldview}%` };
    } else if (creator) {
      // 搜索创作者用户名
      authorNameFilter = creator;
    } else if (id) {
      // 搜索世界观ID (UUID类型)
      whereCondition.id = id;
    } else if (wid) {
      // 搜索世界观编号
      whereCondition.worldviewNumber = parseInt(wid);
    }
    
    // 构建include条件
    const includeConditions = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      },
      {
        model: User,
        as: 'likingUsers',
        attributes: ['id', 'username'],
        through: { attributes: [] }
      }
    ];
    
    // 处理作者过滤条件 - 优先使用具体的搜索参数
    if (authorNameFilter) {
      // 如果有作者名过滤条件（来自creator参数）
      includeConditions[0].where = { 
        username: { [Op.iLike]: `%${authorNameFilter}%` } 
      };
    } else if (authorIdFilter) {
      // 如果有作者ID过滤条件（来自search参数中的数字）
      includeConditions[0].where = { id: authorIdFilter };
    }
    
    const { count, rows: worldviews } = await Worldview.findAndCountAll({
      where: whereCondition,
      include: includeConditions,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      worldviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取世界观列表错误:', error);
    
    // 特殊处理UUID格式错误
    if (error.message && error.message.includes('invalid input syntax for type uuid')) {
      return res.status(400).json({ message: 'UUID格式不正确，请输入有效的UUID' });
    }
    
    res.status(500).json({ message: `服务器错误: ${error.message}` });
  }
});

// 获取单个世界观详情
router.get('/:id', async (req, res) => {
  try {
    // 验证id是否为有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ message: '世界观ID格式不正确' });
    }
    
    const worldview = await Worldview.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar', 'bio']
        },
        {
          model: User,
          as: 'likingUsers',
          attributes: ['id', 'username', 'avatar'],
          through: { attributes: [] }
        }
      ]
    });
    
    if (!worldview) {
      return res.status(404).json({ message: '世界观不存在' });
    }
    
    // 增加浏览量
    await Worldview.update(
      { views: worldview.views + 1 },
      { where: { id: req.params.id } }
    );
    
    // 更新返回的浏览量
    worldview.views += 1;
    
    res.json(worldview);
  } catch (error) {
    console.error(error);
    
    // 特殊处理UUID格式错误
    if (error.message && error.message.includes('invalid input syntax for type uuid')) {
      return res.status(400).json({ message: 'UUID格式不正确，请输入有效的UUID' });
    }
    
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建新世界观
router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('标题不能为空'),
  body('description').notEmpty().withMessage('描述不能为空'),
  body('content').notEmpty().withMessage('内容不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, description, content, coverImage, isPublic } = req.body;
    
    // 获取当前最大的世界观编号
    const maxWorldview = await Worldview.findOne({
      order: [['worldviewNumber', 'DESC']]
    });
    
    // 生成新的世界观编号
    const newWorldviewNumber = maxWorldview ? maxWorldview.worldviewNumber + 1 : 1;
    
    const worldview = await Worldview.create({
      worldviewNumber: newWorldviewNumber,
      title,
      description,
      content,
      category: '默认分类', // 设置默认分类
      tags: [], // 空标签数组
      coverImage: coverImage || '',
      authorId: req.user.id,
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    // 获取包含作者信息的世界观
    const worldviewWithAuthor = await Worldview.findByPk(worldview.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });
    
    res.status(201).json(worldviewWithAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新世界观
router.put('/:id', authenticateToken, [
  body('title').optional().notEmpty().withMessage('标题不能为空'),
  body('description').optional().notEmpty().withMessage('描述不能为空'),
  body('content').optional().notEmpty().withMessage('内容不能为空'),
  body('category').optional().notEmpty().withMessage('分类不能为空').isLength({ max: 50 }).withMessage('分类长度不能超过50个字符')
], async (req, res) => {
  try {
    // 验证id是否为有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ message: '世界观ID格式不正确' });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const worldview = await Worldview.findByPk(req.params.id);
    
    if (!worldview) {
      return res.status(404).json({ message: '世界观不存在' });
    }
    
    // 检查是否是作者
    if (worldview.authorId !== req.user.id) {
      return res.status(403).json({ message: '无权修改此世界观' });
    }
    
    const { title, description, content, coverImage, isPublic } = req.body;
    
    // 更新字段
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    
    await Worldview.update(updateData, { where: { id: req.params.id } });
    
    // 获取更新后的世界观
    const updatedWorldview = await Worldview.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });
    
    res.json(updatedWorldview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除世界观
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // 验证id是否为有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ message: '世界观ID格式不正确' });
    }
    
    const worldview = await Worldview.findByPk(req.params.id);
    
    if (!worldview) {
      return res.status(404).json({ message: '世界观不存在' });
    }
    
    // 检查是否是作者
    if (worldview.authorId !== req.user.id) {
      return res.status(403).json({ message: '无权删除此世界观' });
    }
    
    await Worldview.destroy({ where: { id: req.params.id } });
    
    res.json({ message: '世界观已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 点赞/取消点赞世界观
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    // 验证id是否为有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ message: '世界观ID格式不正确' });
    }
    
    const worldview = await Worldview.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'likingUsers',
        attributes: ['id', 'username'],
        through: { attributes: [] }
      }]
    });
    
    if (!worldview) {
      return res.status(404).json({ message: '世界观不存在' });
    }
    
    const userId = req.user.id;
    
    // 检查是否已经点赞
    const isLiked = worldview.likingUsers ? worldview.likingUsers.some(user => user.id === userId) : false;
    
    if (isLiked) {
      // 取消点赞
      await UserWorldviewLike.destroy({
        where: { userId, worldviewId: req.params.id }
      });
      
      res.json({ 
        message: '取消点赞',
        likesCount: worldview.likingUsers ? worldview.likingUsers.length - 1 : 0
      });
    } else {
      // 点赞
      await UserWorldviewLike.create({
        userId,
        worldviewId: req.params.id
      });
      
      res.json({ 
        message: '点赞成功',
        likesCount: worldview.likingUsers ? worldview.likingUsers.length + 1 : 1
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取指定用户点赞的世界观
router.get('/user/:userId/liked', async (req, res) => {
  try {
    // 验证userId是否为有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.userId)) {
      return res.status(400).json({ message: '用户ID格式不正确' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: worldviews } = await Worldview.findAndCountAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'likingUsers',
          attributes: ['id', 'username'],
          where: { id: req.params.userId },
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      worldviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取当前登录用户的世界观
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: worldviews } = await Worldview.findAndCountAll({
      where: { 
        authorId: req.user.id
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      worldviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取指定用户的世界观
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: worldviews } = await Worldview.findAndCountAll({
      where: { 
        authorId: req.params.userId,
        isPublic: true 
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      worldviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;