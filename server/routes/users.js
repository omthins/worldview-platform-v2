const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User, Worldview, UserWorldviewLike } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 确保头像上传目录存在
const avatarDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + req.user.id + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器，只允许图片
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: fileFilter
});

// 上传头像
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    const userId = req.user.id;
    
    // 获取用户当前头像
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 删除旧头像（如果不是默认头像）
    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    // 更新用户头像
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await User.update(
      { avatar: avatarUrl },
      { where: { id: userId } }
    );
    
    // 返回完整的头像URL
    const fullAvatarUrl = `http://localhost:5000${avatarUrl}`;
    res.json({ avatarUrl: fullAvatarUrl });
  } catch (error) {
    console.error('头像上传错误:', error);
    res.status(500).json({ message: `服务器错误: ${error.message}` });
  }
});

// 错误处理中间件
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '文件大小超过限制（5MB）' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: '文件数量超过限制' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: '上传了意外的文件字段' });
    }
    return res.status(400).json({ message: `文件上传错误: ${err.message}` });
  }
  
  if (err.message === '只允许上传图片文件') {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: `服务器错误: ${err.message}` });
});

// 获取用户点赞的世界观
router.get('/liked', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      include: [{
        model: Worldview,
        as: 'likedWorldviews',
        attributes: ['id', 'title', 'coverImage', 'createdAt', 'views'],
        through: { attributes: [] },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }]
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({ likedWorldviews: user.likedWorldviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户资料
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Worldview,
        as: 'worldviews',
        attributes: ['id', 'title', 'coverImage', 'createdAt', 'views']
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户资料
router.put('/profile', authenticateToken, [
  body('username').optional().isLength({ min: 3, max: 20 }).withMessage('用户名长度应在3-20个字符之间'),
  body('bio').optional().isLength({ max: 500 }).withMessage('个人简介不能超过500个字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, bio, avatar } = req.body;
    const userId = req.user.id;

    // 检查用户名是否已被使用
    if (username) {
      const existingUser = await User.findOne({ 
        where: { 
          username,
          id: { [Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: '用户名已被使用' });
      }
    }

    // 更新用户资料
    const [updatedRowsCount] = await User.update(
      { username, bio, avatar },
      { where: { id: userId } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 修改密码
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('请输入当前密码'),
  body('newPassword').isLength({ min: 6 }).withMessage('新密码至少需要6个字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // 获取用户信息
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 验证当前密码
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: '当前密码不正确' });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 关注用户
router.post('/follow/:id', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: '不能关注自己' });
    }

    const targetUser = await User.findByPk(targetUserId);
    const currentUser = await User.findByPk(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 检查是否已经关注
    // 这里需要创建一个关注关系的中间表，暂时返回成功消息
    // 在实际应用中，你需要创建一个Follow模型来管理关注关系

    res.json({ message: '关注功能需要额外的关注关系表来实现' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 取消关注
router.post('/unfollow/:id', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    const targetUser = await User.findByPk(targetUserId);
    const currentUser = await User.findByPk(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 检查是否已关注
    // 这里需要创建一个关注关系的中间表，暂时返回成功消息
    // 在实际应用中，你需要创建一个Follow模型来管理关注关系

    res.json({ message: '取消关注功能需要额外的关注关系表来实现' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;