const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// 用户注册
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度应在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 }).withMessage('密码长度至少为6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('密码必须包含至少一个大写字母、一个小写字母和一个数字')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ 
        message: '注册信息验证失败',
        details: errorMessages 
      });
    }

    const { username, email, password, avatar } = req.body;

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ 
        message: '注册失败',
        details: ['该邮箱地址已被注册']
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ 
        message: '注册失败',
        details: ['该用户名已被使用']
      });
    }

    // 验证头像是否为空（前端应该已经强制选择，但这里做二次验证）
    if (!avatar) {
      return res.status(400).json({ 
        message: '注册失败',
        details: ['请选择一个头像']
      });
    }
    
    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      avatar
    });

    // 创建 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      details: ['注册过程中发生未知错误，请稍后重试']
    });
  }
});

// 用户登录
router.post('/login', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ 
        message: '登录信息验证失败',
        details: errorMessages 
      });
    }

    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ 
        message: '登录失败',
        details: ['该邮箱地址未注册']
      });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: '登录失败',
        details: ['密码错误']
      });
    }

    // 创建 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      details: ['登录过程中发生未知错误，请稍后重试']
    });
  }
});

// 获取当前用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      details: ['获取用户信息时发生错误，请稍后重试']
    });
  }
});

module.exports = router;