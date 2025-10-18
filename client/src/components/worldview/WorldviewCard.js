import React from 'react';
import { Link } from 'react-router-dom';
import './WorldviewCard.css';

const WorldviewCard = ({ worldview, showNumber = false, showEdit = false }) => {
  const { id, title, description, author } = worldview;

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
        </div>
        
        <div className="card-description">
          <Link to={`/worldview/${id}`} className="description-link">
            <p>{description}</p>
          </Link>
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
            <Link to={`/profile/${author?.id}`} className="author-name-link">
              <span className="author-name">{author?.username || '匿名用户'}</span>
            </Link>
          </div>
          
          <div className="card-footer-right">

            
            {showEdit && (
              <div className="card-actions">
                <Link to={`/edit-worldview/${id}`} className="btn btn-sm btn-primary">
                  编辑
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldviewCard;