import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    // 账户设置
    emailNotifications: true,
    pushNotifications: false,
    language: 'zh-CN',
    
    // 隐私设置
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: 'everyone',
    
    // 主题设置
    theme: 'dark',
    fontSize: 'medium',
    
    // 通知设置
    emailDigest: true,
    newFollowerEmail: true,
    worldviewUpdateEmail: false
  });

  const handleSettingChange = (settingKey, value) => {
    setSettings(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  const handleSaveSettings = () => {
    // 这里可以添加保存设置到后端的逻辑
    console.log('保存设置:', settings);
    alert('设置已保存！');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>设置</h1>
          <p>管理您的账户偏好和隐私设置</p>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <button 
              className={`sidebar-tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <span className="tab-icon">👤</span>
              账户设置
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="tab-icon">🔒</span>
              隐私设置
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <span className="tab-icon">🎨</span>
              外观设置
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="tab-icon">🔔</span>
              通知设置
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'account' && (
              <div className="settings-section">
                <h2>账户设置</h2>
                <div className="setting-item">
                  <label>邮箱通知</label>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>推送通知</label>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>语言设置</label>
                  <div className="setting-control">
                    <select 
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="setting-select"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h2>隐私设置</h2>
                <div className="setting-item">
                  <label>个人资料可见性</label>
                  <div className="setting-control">
                    <select 
                      value={settings.profileVisibility}
                      onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      className="setting-select"
                    >
                      <option value="public">公开</option>
                      <option value="friends">仅好友</option>
                      <option value="private">私密</option>
                    </select>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>显示在线状态</label>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.showOnlineStatus}
                        onChange={(e) => handleSettingChange('showOnlineStatus', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>允许接收消息</label>
                  <div className="setting-control">
                    <select 
                      value={settings.allowMessages}
                      onChange={(e) => handleSettingChange('allowMessages', e.target.value)}
                      className="setting-select"
                    >
                      <option value="everyone">所有人</option>
                      <option value="friends">仅好友</option>
                      <option value="none">不允许</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h2>外观设置</h2>
                <div className="setting-item">
                  <label>主题</label>
                  <div className="setting-control">
                    <select 
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="setting-select"
                    >
                      <option value="dark">深色</option>
                      <option value="light">浅色</option>
                      <option value="auto">跟随系统</option>
                    </select>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>字体大小</label>
                  <div className="setting-control">
                    <select 
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                      className="setting-select"
                    >
                      <option value="small">小</option>
                      <option value="medium">中</option>
                      <option value="large">大</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2>通知设置</h2>
                <div className="setting-item">
                  <label>邮件摘要</label>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.emailDigest}
                        onChange={(e) => handleSettingChange('emailDigest', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>新关注者邮件通知</label>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.newFollowerEmail}
                        onChange={(e) => handleSettingChange('newFollowerEmail', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>世界观更新邮件通知</label>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.worldviewUpdateEmail}
                        onChange={(e) => handleSettingChange('worldviewUpdateEmail', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="settings-actions">
              <button className="btn btn-primary" onClick={handleSaveSettings}>
                保存设置
              </button>
              <button className="btn btn-secondary" onClick={() => setSettings({
                emailNotifications: true,
                pushNotifications: false,
                language: 'zh-CN',
                profileVisibility: 'public',
                showOnlineStatus: true,
                allowMessages: 'everyone',
                theme: 'dark',
                fontSize: 'medium',
                emailDigest: true,
                newFollowerEmail: true,
                worldviewUpdateEmail: false
              })}>
                重置为默认
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;