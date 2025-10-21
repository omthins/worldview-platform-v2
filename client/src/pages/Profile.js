import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest, API_ENDPOINTS } from '../utils/api';
import AvatarUpload from '../components/AvatarUpload';
import DefaultAvatarSelector from '../components/DefaultAvatarSelector';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [isAuthenticated, user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const data = await apiRequest(API_ENDPOINTS.USERS_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      
      setMessage('个人资料更新成功！');
      updateUser(data.user);
    } catch (err) {
      setMessage(err.message || '更新失败，请重试');
      console.error('更新个人资料失败:', err);
    }
    
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('新密码和确认密码不匹配');
      return;
    }
    
    setPasswordLoading(true);
    setPasswordMessage('');
    
    try {
      await apiRequest(API_ENDPOINTS.USERS_PASSWORD, {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      setPasswordMessage('密码修改成功！');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordMessage(err.message || '密码修改失败，请重试');
      console.error('修改密码失败:', err);
    }
    
    setPasswordLoading(false);
  };

  // 如果有ID参数，则重定向到UserProfile页面
  if (id) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="text-center mt-5">正在跳转到用户资料页面...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="login-prompt">
            <h2>请先登录</h2>
            <p>您需要登录才能查看个人资料页面</p>
            <a href="/login" className="btn btn-primary">去登录</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={profileData.avatar || 'https://picsum.photos/seed/avatar/150/150.jpg'} 
              alt="用户头像" 
            />
          </div>
          <div className="profile-info">
            <h1>{profileData.username}</h1>
            <p className="profile-email">{profileData.email}</p>
            <p className="profile-id">用户ID: {user?.id}</p>
            {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            编辑资料
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            修改密码
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-form-container">
              <h2>编辑个人资料</h2>
              {message && <div className="alert alert-info">{message}</div>}
              
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="username">用户名</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">邮箱</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">个人简介</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="form-control"
                    rows="4"
                    placeholder="介绍一下你自己..."
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>头像</label>
                  <div className="avatar-options-container">
                    <div className="avatar-option-section">
                      <h5>预设头像</h5>
                      <DefaultAvatarSelector 
                        onAvatarSelect={async (avatarUrl) => {
                          // 更新本地状态
                          setProfileData({...profileData, avatar: avatarUrl});
                          
                          // 直接更新用户上下文中的头像
                          if (updateUser) {
                            updateUser({...user, avatar: avatarUrl});
                          }
                        }}
                        currentAvatar={profileData.avatar}
                      />
                    </div>
                    
                    <div className="avatar-option-section">
                      <h5>上传自定义头像</h5>
                      <AvatarUpload 
                        currentAvatar={profileData.avatar}
                        onAvatarChange={async (avatarUrl) => {
                          // 更新本地状态
                          setProfileData({...profileData, avatar: avatarUrl});
                          
                          // 直接更新用户上下文中的头像
                          if (updateUser) {
                            updateUser({...user, avatar: avatarUrl});
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? '保存中...' : '保存更改'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="password-form-container">
              <h2>修改密码</h2>
              {passwordMessage && <div className="alert alert-info">{passwordMessage}</div>}
              
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">当前密码</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">新密码</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">确认新密码</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                    minLength="6"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? '修改中...' : '修改密码'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;