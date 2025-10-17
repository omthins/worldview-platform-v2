import React, { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Input, 
  List, 
  Avatar, 
  Typography, 
  Space, 
  Popover,
  Badge,
  message
} from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  UserOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ChatWidget.css';

const { Text } = Typography;
const { TextArea } = Input;

const ChatWidget = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user && visible) {
      loadChatRooms();
    }
  }, [user, visible]);

  useEffect(() => {
    if (selectedRoom) {
      loadRoomMessages();
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatRooms = async () => {
    try {
      const response = await chatAPI.getRooms();
      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error('加载聊天室失败:', error);
    }
  };

  const loadRoomMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getRoomMessages(selectedRoom.id);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('加载消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await chatAPI.sendMessage(selectedRoom.id, newMessage);
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUnreadCount = (room) => {
    // 这里可以添加未读消息计数逻辑
    return 0;
  };

  const chatContent = (
    <div className="chat-widget-content">
      <div className="chat-header">
        <Text strong>聊天</Text>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          size="small"
          onClick={() => setVisible(false)}
        />
      </div>

      <div className="chat-body">
        {!selectedRoom ? (
          <div className="chat-room-list">
            <Text type="secondary" style={{ padding: '16px', display: 'block' }}>
              选择聊天室开始对话
            </Text>
            <List
              dataSource={rooms}
              renderItem={(room) => (
                <List.Item 
                  className="chat-room-item"
                  onClick={() => setSelectedRoom(room)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={getUnreadCount(room)} size="small">
                        <Avatar 
                          icon={<UserOutlined />} 
                          size="small"
                        />
                      </Badge>
                    }
                    title={
                      <Text style={{ fontSize: '14px' }}>
                        {room.name}
                      </Text>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {room.users?.length || 0} 位参与者
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div className="chat-messages-container">
            <div className="chat-room-header">
              <Button 
                type="text" 
                size="small"
                onClick={() => setSelectedRoom(null)}
                style={{ marginRight: '8px' }}
              >
                ← 返回
              </Button>
              <Text strong>{selectedRoom.name}</Text>
            </div>

            <div className="chat-messages">
              <List
                dataSource={messages}
                loading={loading}
                renderItem={(msg) => (
                  <List.Item className="chat-message-item">
                    <div className={`message-bubble ${msg.userId === user.id ? 'own' : 'other'}`}>
                      <div className="message-header">
                        <Avatar 
                          size="small" 
                          icon={<UserOutlined />}
                          src={msg.user?.avatar}
                        />
                        <Text style={{ marginLeft: '8px', fontSize: '12px' }}>
                          {msg.user?.username || '用户'}
                        </Text>
                        <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                          {new Date(msg.createdAt).toLocaleTimeString('zh-CN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Text>
                      </div>
                      <div className="message-content">
                        {msg.content}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <TextArea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                rows={2}
                maxLength={500}
                style={{ marginBottom: '8px' }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="small"
              >
                发送
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <Popover
      content={chatContent}
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
      placement="topRight"
      overlayClassName="chat-widget-popover"
    >
      <Badge count={0} size="small" offset={[-5, 5]}>
        <Button 
          type="primary" 
          icon={<MessageOutlined />}
          className="chat-widget-button"
          shape="circle"
        />
      </Badge>
    </Popover>
  );
};

export default ChatWidget;