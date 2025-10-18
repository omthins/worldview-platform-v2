import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import WorldviewCard from '../components/worldview/WorldviewCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [myWorldviews, setMyWorldviews] = useState([]);
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
          <h1>欢迎回来，{user?.username}！</h1>
          <Link to="/create-worldview" className="btn btn-primary">
            发布新世界观
          </Link>
        </div>

        <div className="dashboard-content">
          <div className="tabs">
            <button
              className={`tab active`}
            >
              我的世界观
            </button>
          </div>

          <div className="tab-content">
            {loading ? (
              <div className="text-center">加载中...</div>
            ) : (
              <div className="worldviews-grid">
                {myWorldviews.length > 0 ? (
                    myWorldviews.map(worldview => (
                      <WorldviewCard key={worldview.id} worldview={worldview} showNumber={true} />
                    ))
                  ) : (
                    <div className="empty-state">
                      <h3>还没有发布世界观</h3>
                      <p>开始创建你的第一个世界观吧！</p>
                      <Link to="/create-worldview" className="btn btn-primary">
                        发布世界观
                      </Link>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;