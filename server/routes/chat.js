const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { User, ChatRoom, ChatMessage } = require('../models');

// 创建聊天室
router.post('/rooms', authenticateToken, async (req, res) => {
  try {
    const { participantIds, name } = req.body;
    
    if (!participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ success: false, message: '参与者ID列表无效' });
    }

    // 确保参与者包括当前用户
    const allParticipants = [...new Set([req.user.id, ...participantIds])];
    
    // 检查是否已存在相同的聊天室
    const existingRoom = await ChatRoom.findOne({
      include: [{
        model: User,
        through: { attributes: [] },
        where: { id: allParticipants },
        required: true
      }],
      group: ['ChatRoom.id'],
      having: sequelize.literal(`COUNT(DISTINCT Users.id) = ${allParticipants.length}`)
    });

    if (existingRoom) {
      return res.json({ success: true, data: existingRoom });
    }

    // 创建新聊天室
    const room = await ChatRoom.create({
      name: name || `聊天室_${Date.now()}`,
      createdBy: req.user.id
    });

    // 添加参与者
    await room.addUsers(allParticipants);

    const roomWithUsers = await ChatRoom.findByPk(room.id, {
      include: [{
        model: User,
        through: { attributes: [] },
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.status(201).json({ success: true, data: roomWithUsers });
  } catch (error) {
    console.error('创建聊天室失败:', error);
    res.status(500).json({ success: false, message: '创建聊天室失败' });
  }
});

// 获取用户聊天室列表
router.get('/rooms', authenticateToken, async (req, res) => {
  try {
    const rooms = await ChatRoom.findAll({
      include: [{
        model: User,
        through: { attributes: [] },
        attributes: ['id', 'username', 'avatar']
      }, {
        model: ChatMessage,
        separate: true,
        order: [['createdAt', 'DESC']],
        limit: 1,
        include: [{
          model: User,
          attributes: ['id', 'username']
        }]
      }],
      where: {
        '$Users.id$': req.user.id
      },
      order: [['updatedAt', 'DESC']]
    });

    res.json({ success: true, data: rooms });
  } catch (error) {
    console.error('获取聊天室失败:', error);
    res.status(500).json({ success: false, message: '获取聊天室失败' });
  }
});

// 获取聊天室消息
router.get('/rooms/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // 验证用户是否在聊天室中
    const room = await ChatRoom.findOne({
      include: [{
        model: User,
        through: { attributes: [] },
        where: { id: req.user.id }
      }],
      where: { id: roomId }
    });

    if (!room) {
      return res.status(403).json({ success: false, message: '无权访问此聊天室' });
    }

    const messages = await ChatMessage.findAll({
      where: { roomId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    console.error('获取消息失败:', error);
    res.status(500).json({ success: false, message: '获取消息失败' });
  }
});

// 发送消息
router.post('/rooms/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: '消息内容不能为空' });
    }

    // 验证用户是否在聊天室中
    const room = await ChatRoom.findOne({
      include: [{
        model: User,
        through: { attributes: [] },
        where: { id: req.user.id }
      }],
      where: { id: roomId }
    });

    if (!room) {
      return res.status(403).json({ success: false, message: '无权在此聊天室发送消息' });
    }

    const message = await ChatMessage.create({
      roomId,
      userId: req.user.id,
      content: content.trim()
    });

    // 更新聊天室更新时间
    await room.update({ updatedAt: new Date() });

    const messageWithUser = await ChatMessage.findByPk(message.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.status(201).json({ success: true, data: messageWithUser });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ success: false, message: '发送消息失败' });
  }
});

module.exports = router;