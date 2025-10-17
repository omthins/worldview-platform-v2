import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import WorldviewCard from '../components/worldview/WorldviewCard';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userWorldviews, setUserWorldviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setError('用户ID未提供');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // 获取用户基本信息
        const userData = await apiRequest(`/api/users/${id}`);
        setUserData(userData);
        
        // 获取用户的世界观
        const worldviewsData = await apiRequest(`/api/worldviews/user/${id}`);
        setUserWorldviews(worldviewsData.worldviews || []);
        
        setLoading(false);
      } catch (err) {
        setError(err.message || '获取用户信息失败');
        console.error('获取用户数据失败:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);



  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="container">
          <div className="text-center mt-5">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="user-profile-page">
        <div className="container">
          <div className="text-center mt-5">用户不存在</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="container">
        <div className="user-profile-header">
          <div className="user-profile-avatar">
            <img 
              src={userData.avatar || 'https://picsum.photos/seed/avatar/150/150.jpg'} 
              alt="用户头像" 
            />
          </div>
          <div className="user-profile-info">
            <h1>{userData.username}</h1>
            <p className="user-profile-email">{userData.email}</p>
            <p className="user-profile-id">用户ID: {userData.id}</p>
            {userData.bio && <p className="user-profile-bio">{userData.bio}</p>}
          </div>
        </div>

        <div className="user-profile-content">
          <div className="user-worldviews-section">
            <h2>用户的世界观</h2>
            {userWorldviews.length > 0 ? (
              <div className="worldviews-grid">
                {userWorldviews.map(worldview => (
                  <WorldviewCard 
                    key={worldview.id} 
                    worldview={worldview}
                    showNumber={true}
                  />
                ))}
              </div>
            ) : (
              <p>该用户还没有创建任何世界观</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;