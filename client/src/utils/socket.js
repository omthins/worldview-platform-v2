import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO 连接成功');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO 连接断开');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO 连接错误:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 加入聊天室
  joinRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinRoom', roomId);
    }
  }

  // 离开聊天室
  leaveRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveRoom', roomId);
    }
  }

  // 发送消息
  sendMessage(roomId, content) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', { roomId, content });
    }
  }

  // 订阅通知
  subscribeNotifications(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribeNotifications', userId);
    }
  }

  // 取消订阅通知
  unsubscribeNotifications(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('unsubscribeNotifications', userId);
    }
  }

  // 监听事件
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // 取消监听事件
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// 创建单例实例
const socketService = new SocketService();
export default socketService;