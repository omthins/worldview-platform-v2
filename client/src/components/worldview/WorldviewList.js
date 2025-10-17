import React from 'react';
import { Link } from 'react-router-dom';
import './WorldviewList.css';

const WorldviewList = ({ worldview, showNumber }) => {
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

  // 获取作者头像的首字母
  const getAuthorInitial = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="worldview-list-item">
      <div className="list-item-content">
        <div className="list-item-header">
          <Link to={`/worldview/${id}`} className="list-item-title">
            <h3>{title}</h3>
          </Link>
          {category && (
            <span className="list-item-category">{category}</span>
          )}
        </div>
        
        <div className="list-item-description">
          <p>{description}</p>
        </div>
        
        <div className="list-item-footer">
          <div className="list-item-meta">
            <div className="list-item-author">
              <div className="author-avatar">
                {getAuthorInitial(author?.username)}
              </div>
              <span className="author-name">{author?.username || '匿名用户'}</span>
            </div>
            <div className="list-item-stats">
              <span className="stat views">
                <i className="icon-eye"></i>
                {formatNumber(views || 0)}
              </span>
              <span className="stat likes">
                <i className="icon-heart"></i>
                {formatNumber(likes || 0)}
              </span>
            </div>
            <div className="list-item-date">
              {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldviewList;