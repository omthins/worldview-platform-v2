const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Socket.IO 连接管理
class SocketManager {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST']
      }
    });
    
    this.connectedUsers = new Map();
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.use(this.authenticateSocket.bind(this));
    
    this.io.on('connection', (socket) => {
      console.log(`用户 ${socket.user?.username} 已连接`);
      
      // 将用户添加到在线列表
      if (socket.user) {
        this.connectedUsers.set(socket.user.id, socket);
        this.io.emit('userOnline', { userId: socket.user.id, username: socket.user.username });
      }

      // 聊天相关事件
      socket.on('joinRoom', (roomId) => {
        socket.join(`room_${roomId}`);
        console.log(`用户 ${socket.user?.username} 加入房间 ${roomId}`);
      });

      socket.on('leaveRoom', (roomId) => {
        socket.leave(`room_${roomId}`);
        console.log(`用户 ${socket.user?.username} 离开房间 ${roomId}`);
      });

      socket.on('sendMessage', async (data) => {
        try {
          const { roomId, content } = data;
          
          // 广播消息到房间
          socket.to(`room_${roomId}`).emit('newMessage', {
            id: Date.now(),
            roomId,
            userId: socket.user.id,
            username: socket.user.username,
            content,
            createdAt: new Date().toISOString()
          });

          // 保存消息到数据库的逻辑可以在这里添加
          console.log(`用户 ${socket.user.username} 在房间 ${roomId} 发送消息: ${content}`);
        } catch (error) {
          console.error('发送消息错误:', error);
          socket.emit('messageError', { error: '发送消息失败' });
        }
      });

      // 通知相关事件
      socket.on('subscribeNotifications', (userId) => {
        socket.join(`notifications_${userId}`);
        console.log(`用户 ${userId} 订阅通知`);
      });

      socket.on('unsubscribeNotifications', (userId) => {
        socket.leave(`notifications_${userId}`);
        console.log(`用户 ${userId} 取消订阅通知`);
      });

      // 断开连接处理
      socket.on('disconnect', () => {
        console.log(`用户 ${socket.user?.username} 已断开连接`);
        
        if (socket.user) {
          this.connectedUsers.delete(socket.user.id);
          this.io.emit('userOffline', { userId: socket.user.id });
        }
      });
    });
  }

  // Socket 认证中间件
  async authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('认证失败: 缺少token'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('认证失败: 无效token'));
    }
  }

  // 发送通知给特定用户
  sendNotificationToUser(userId, notification) {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit('newNotification', notification);
    }
  }

  // 广播消息到房间
  broadcastToRoom(roomId, event, data) {
    this.io.to(`room_${roomId}`).emit(event, data);
  }

  // 获取在线用户列表
  getOnlineUsers() {
    return Array.from(this.connectedUsers.values()).map(socket => ({
      id: socket.user.id,
      username: socket.user.username
    }));
  }
}

module.exports = SocketManager;