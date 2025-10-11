const express = require('express');
const { body, validationResult } = require('express-validator');
const { Comment, User, UserCommentLike } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取世界观的评论
router.get('/worldview/:worldviewId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const { count, rows: comments } = await Comment.findAndCountAll({
      where: { 
        worldviewId: req.params.worldviewId,
        parentCommentId: null 
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Comment,
          as: 'replies',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建评论
router.post('/', authenticateToken, [
  body('content').isLength({ min: 1, max: 500 }).withMessage('评论内容长度应在1-500个字符之间'),
  body('worldviewId').notEmpty().withMessage('世界观ID不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { content, worldviewId, parentCommentId } = req.body;
    
    const comment = await Comment.create({
      content,
      authorId: req.user.id,
      worldviewId,
      parentCommentId: parentCommentId || null
    });
    
    // 获取包含作者信息的评论
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });
    
    res.status(201).json(commentWithAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除评论
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    // 检查是否是评论作者
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ message: '无权删除此评论' });
    }
    
    await Comment.destroy({ where: { id: req.params.id } });
    
    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 点赞/取消点赞评论
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    
    // 检查是否已经点赞
    const isLiked = await UserCommentLike.findOne({
      where: { userId, commentId: req.params.id }
    });
    
    if (isLiked) {
      // 取消点赞
      await UserCommentLike.destroy({
        where: { userId, commentId: req.params.id }
      });
      
      // 更新点赞数
      await Comment.update(
        { likes: comment.likes - 1 },
        { where: { id: req.params.id } }
      );
      
      res.json({ 
        message: '取消点赞',
        likesCount: comment.likes - 1
      });
    } else {
      // 点赞
      await UserCommentLike.create({
        userId,
        commentId: req.params.id
      });
      
      // 更新点赞数
      await Comment.update(
        { likes: comment.likes + 1 },
        { where: { id: req.params.id } }
      );
      
      res.json({ 
        message: '点赞成功',
        likesCount: comment.likes + 1
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;