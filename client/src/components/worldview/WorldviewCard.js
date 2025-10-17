import React from 'react';
import { Link } from 'react-router-dom';
import './WorldviewCard.css';

const WorldviewCard = ({ worldview, showNumber = false }) => {
  const { id, title, description, author, views, likes, createdAt, category } = worldview;

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 格式化数字
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  // 获取作者头像
  const getAuthorAvatar = (author) => {
    if (author?.avatar) {
      return author.avatar;
    }
    // 如果没有头像，使用首字母
    return author?.username ? author.username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="worldview-card">
      <div className="card-content">
        <div className="card-header">
          <Link to={`/worldview/${id}`} className="card-title">
            <h3>{title}</h3>
          </Link>
          {category && (
            <span className="card-category">{category}</span>
          )}
        </div>
        
        <div className="card-description">
          <p>{description}</p>
        </div>
        
        <div className="card-divider"></div>
        
        <div className="card-footer">
          <div className="card-author">
            <div className="author-avatar">
              {author?.avatar ? (
                <img src={author.avatar} alt={author.username} />
              ) : (
                <span className="avatar-initial">{getAuthorAvatar(author)}</span>
              )}
            </div>
            <span className="author-name">{author?.username || '匿名用户'}</span>
          </div>
          
          <div className="card-stats">
            <div className="stat-item">
              <span className="stat-icon">👁</span>
              <span className="stat-value">{formatNumber(views || 0)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">❤️</span>
              <span className="stat-value">{formatNumber(likes || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldviewCard;