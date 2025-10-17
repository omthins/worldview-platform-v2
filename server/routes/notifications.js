const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Notification } = require('../models');

// 获取用户通知列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id, isArchived: false };
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Notification.count({ where: whereClause });
    const unreadCount = await Notification.count({ 
      where: { userId: req.user.id, isRead: false, isArchived: false } 
    });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('获取通知失败:', error);
    res.status(500).json({ success: false, message: '获取通知失败' });
  }
});

// 标记通知为已读
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: '通知不存在' });
    }

    await notification.update({ isRead: true });
    res.json({ success: true, message: '标记为已读' });
  } catch (error) {
    console.error('标记通知失败:', error);
    res.status(500).json({ success: false, message: '标记通知失败' });
  }
});

// 标记所有通知为已读
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.json({ success: true, message: '所有通知已标记为已读' });
  } catch (error) {
    console.error('标记所有通知失败:', error);
    res.status(500).json({ success: false, message: '标记所有通知失败' });
  }
});

// 归档通知
router.put('/:id/archive', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: '通知不存在' });
    }

    await notification.update({ isArchived: true });
    res.json({ success: true, message: '通知已归档' });
  } catch (error) {
    console.error('归档通知失败:', error);
    res.status(500).json({ success: false, message: '归档通知失败' });
  }
});

// 获取未读通知数量
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false, isArchived: false }
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('获取未读数量失败:', error);
    res.status(500).json({ success: false, message: '获取未读数量失败' });
  }
});

module.exports = router;