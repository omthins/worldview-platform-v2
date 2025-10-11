import React from 'react';
import { Link } from 'react-router-dom';
import './WorldviewCard.css';

const WorldviewCard = ({ worldview, showNumber = false }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="worldview-card">
      <Link to={`/worldview/${worldview.id}`}>
        {worldview.coverImage ? (
          <div className="card-image">
            <img src={worldview.coverImage} alt={worldview.title} />
          </div>
        ) : (
          <div className="card-image-placeholder">
            <span>{worldview.category}</span>
          </div>
        )}
        
        <div className="card-content">
          <h3 className="card-title">{worldview.title}</h3>
          {showNumber && <div className="card-worldview-number">编号: #{worldview.worldviewNumber}</div>}
          <p className="card-description">{worldview.description}</p>
          
          <div className="card-meta">
            <div className="card-author">
              <img 
                src={worldview.author.avatar || 'https://picsum.photos/seed/avatar/30/30.jpg'} 
                alt="作者头像" 
                className="author-avatar"
              />
              <span>{worldview.author.username}</span>
            </div>
            
            <div className="card-stats">
              <span className="card-views">
                <i className="icon-eye"></i> {worldview.views}
              </span>
              <span className="card-likes">
                <i className="icon-heart"></i> {worldview.likingUsers ? worldview.likingUsers.length : 0}
              </span>
            </div>
          </div>
          
          <div className="card-footer">
            <span className="card-date">{formatDate(worldview.createdAt)}</span>
            <span className="card-category">{worldview.category}</span>
          </div>
          
          {worldview.tags && worldview.tags.length > 0 && (
            <div className="card-tags">
              {worldview.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default WorldviewCard;