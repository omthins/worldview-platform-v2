import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import WorldviewCard from '../components/worldview/WorldviewCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [myWorldviews, setMyWorldviews] = useState([]);
  const [recentWorldviews, setRecentWorldviews] = useState([]);
  const [stats, setStats] = useState({
    totalWorldviews: 0,
    publicWorldviews: 0,
    privateWorldviews: 0
  });
  const [activeTab, setActiveTab] = useState('myWorldviews');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        console.error('用户信息或用户ID未定义');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // 获取用户的世界观
        const myData = await apiRequest(`/api/worldviews/user/${user.id}`);
        setMyWorldviews(myData.worldviews);
        
        // 获取最近的世界观
        const recentData = await apiRequest('/api/worldviews/recent');
        setRecentWorldviews(recentData.worldviews || []);
        
        // 计算统计数据
        const total = myData.worldviews.length;
        const publicCount = myData.worldviews.filter(w => w.isPublic).length;
        const privateCount = total - publicCount;
        
        setStats({
          totalWorldviews: total,
          publicWorldviews: publicCount,
          privateWorldviews: privateCount
        });
        
        setLoading(false);
      } catch (err) {
        console.error('获取数据失败:', err);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);



  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>欢迎回来，{user?.username}！</h1>
            <p className="welcome-subtitle">管理你的世界观创作</p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">📚</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalWorldviews}</div>
              <div className="stat-label">总世界观数</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon public">🌐</div>
            <div className="stat-content">
              <div className="stat-number">{stats.publicWorldviews}</div>
              <div className="stat-label">公开世界观</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon private">🔒</div>
            <div className="stat-content">
              <div className="stat-number">{stats.privateWorldviews}</div>
              <div className="stat-label">私有世界观</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'myWorldviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('myWorldviews')}
            >
              我的世界观
            </button>
            <button
              className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              最近更新
            </button>
          </div>

          <div className="tab-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
              </div>
            ) : (
              <>
                {activeTab === 'myWorldviews' && (
                  <div className="worldviews-section">
                    {myWorldviews.length > 0 ? (
                      <div className="worldviews-grid">
                        {myWorldviews.map(worldview => (
                          <WorldviewCard 
                            key={worldview.id} 
                            worldview={worldview} 
                            showNumber={true}
                            showEdit={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>还没有发布世界观</h3>
                        <p>开始创建你的第一个世界观吧！分享你的创意世界。</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'recent' && (
                  <div className="recent-section">
                    {recentWorldviews.length > 0 ? (
                      <div className="worldviews-grid">
                        {recentWorldviews.map(worldview => (
                          <WorldviewCard 
                            key={worldview.id} 
                            worldview={worldview} 
                            showNumber={true}
                            showDate={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">🕒</div>
                        <h3>暂无最近更新</h3>
                        <p>这里将显示最近更新的世界观内容。</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;