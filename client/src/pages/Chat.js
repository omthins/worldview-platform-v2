import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  List, 
  Input, 
  Button, 
  Avatar, 
  Typography, 
  Space, 
  Card,
  Empty,
  message
} from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  UserOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

const { Content } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;

const Chat = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user]);

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
      message.error('加载聊天室失败');
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
      message.error('加载消息失败');
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

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.users?.some(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!user) {
    return (
      <Content className="chat-container">
        <Empty description="请先登录使用聊天功能" />
      </Content>
    );
  }

  return (
    <Layout className="chat-layout">
      <Content className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <Title level={4} style={{ margin: 0 }}>聊天室</Title>
            <Button type="primary" size="small">
              新建聊天
            </Button>
          </div>
          
          <div className="chat-search">
            <Input
              placeholder="搜索聊天室..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </div>

          <div className="chat-room-list">
            {filteredRooms.length > 0 ? (
              <List
                dataSource={filteredRooms}
                renderItem={(room) => (
                  <List.Item 
                    className={`chat-room-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<UserOutlined />}
                          src={room.users?.[0]?.avatar}
                        />
                      }
                      title={
                        <Text ellipsis={{ tooltip: room.name }}>
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
            ) : (
              <Empty 
                description="暂无聊天室" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '40px 0' }}
              />
            )}
          </div>
        </div>

        <div className="chat-main">
          {selectedRoom ? (
            <>
              <div className="chat-header">
                <Space>
                  <Avatar 
                    icon={<UserOutlined />}
                    src={selectedRoom.users?.[0]?.avatar}
                  />
                  <div>
                    <Text strong>{selectedRoom.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {selectedRoom.users?.length || 0} 位参与者在线
                    </Text>
                  </div>
                </Space>
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
                            {new Date(msg.createdAt).toLocaleString('zh-CN')}
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

              <div className="chat-input-area">
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入消息..."
                  rows={3}
                  maxLength={1000}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{ marginTop: '8px' }}
                >
                  发送
                </Button>
              </div>
            </>
          ) : (
            <div className="chat-welcome">
              <MessageOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
              <Title level={3} style={{ color: '#bfbfbf' }}>
                选择一个聊天室开始对话
              </Title>
              <Text type="secondary">
                与朋友和社区成员进行实时交流
              </Text>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Chat;