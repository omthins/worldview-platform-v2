import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WorldviewCard from '../components/worldview/WorldviewCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [myWorldviews, setMyWorldviews] = useState([]);
  const [likedWorldviews, setLikedWorldviews] = useState([]);
  const [activeTab, setActiveTab] = useState('my');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取用户的世界观
        const myRes = await fetch(`/api/worldviews/user/${user.id}`);
        const myData = await myRes.json();
        setMyWorldviews(myData.worldviews);
        
        // 获取用户点赞的世界观
        const likedRes = await fetch('/api/worldviews/liked');
        const likedData = await likedRes.json();
        setLikedWorldviews(likedData.worldviews);
        
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
      <div className="dashboard-header">
        <h1>欢迎回来，{user?.username}！</h1>
        <Link to="/create-worldview" className="btn btn-primary">
          创建新世界观
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            我的世界观
          </button>
          <button
            className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
            onClick={() => setActiveTab('liked')}
          >
            点赞的世界观
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="text-center">加载中...</div>
          ) : (
            <>
              {activeTab === 'my' && (
                <div className="worldviews-grid">
                  {myWorldviews.length > 0 ? (
                      myWorldviews.map(worldview => (
                        <WorldviewCard key={worldview.id} worldview={worldview} showNumber={true} />
                      ))
                    ) : (
                      <div className="empty-state">
                        <h3>还没有创建世界观</h3>
                        <p>开始创建你的第一个世界观吧！</p>
                        <Link to="/create-worldview" className="btn btn-primary">
                          创建世界观
                        </Link>
                      </div>
                    )}
                </div>
              )}
              
              {activeTab === 'liked' && (
                <div className="worldviews-grid">
                  {likedWorldviews.length > 0 ? (
                      likedWorldviews.map(worldview => (
                        <WorldviewCard key={worldview.id} worldview={worldview} showNumber={true} />
                      ))
                    ) : (
                      <div className="empty-state">
                        <h3>还没有点赞任何世界观</h3>
                        <p>去首页看看其他用户的世界观吧！</p>
                        <Link to="/" className="btn btn-primary">
                          浏览世界观
                        </Link>
                      </div>
                    )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;