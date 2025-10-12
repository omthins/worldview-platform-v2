import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './WorldviewCard.css';

const WorldviewCard = ({ worldview, showNumber = false }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${worldview.author.id}`);
  };

  return (
    <div className="worldview-card">
      <Link to={`/worldview/${worldview.id}`} className="card-image-link">
        <div className="card-image">
          {worldview.coverImage ? (
            <img src={worldview.coverImage} alt={worldview.title} />
          ) : (
            <div className="card-image-placeholder">
              <span>{worldview.category}</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="card-content">
        <h3 className="card-title">
          {worldview.title}
        </h3>
        
        <p className="card-description">{worldview.description}</p>
        
        <div className="card-meta">
          <div className="card-author">
            <img 
              src={worldview.author.avatar || 'https://picsum.photos/seed/avatar/30/30.jpg'} 
              alt="作者头像" 
              className="author-avatar"
            />
            <span onClick={handleAuthorClick} className="author-link">
              {worldview.author.username}
            </span>
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
        
        <div className="card-divider"></div>
      </div>
      
      <div className="card-footer">
        <span className="card-date">{formatDate(worldview.createdAt)}</span>
        {worldview.tags && worldview.tags.length > 0 && (
          <span className="tag">#{worldview.tags[0]}</span>
        )}
      </div>
    </div>
  );
};

export default WorldviewCard;