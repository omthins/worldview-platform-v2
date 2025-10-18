import React, { useState } from 'react';
import './LikeButton.css';

const LikeButton = ({ 
  isLiked = false, 
  likeCount = 0, 
  onLike, 
  size = 'medium',
  showCount = true 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      // 动画结束后重置状态
      setTimeout(() => setIsAnimating(false), 600);
      onLike?.();
    }
  };

  const getButtonClass = () => {
    const classes = ['like-button'];
    if (isLiked) classes.push('liked');
    if (isAnimating) classes.push('animating');
    if (size) classes.push(`size-${size}`);
    return classes.join(' ');
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={handleClick}
      aria-label={isLiked ? '取消点赞' : '点赞'}
    >
      <div className="like-icon">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          className="like-svg"
        >
          <path 
            fill="currentColor" 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>
      {showCount && likeCount > 0 && (
        <span className="like-count">{likeCount}</span>
      )}
    </button>
  );
};

export default LikeButton;