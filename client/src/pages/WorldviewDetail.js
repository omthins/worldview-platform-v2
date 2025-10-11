import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
// import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/comments/CommentSection';
import './WorldviewDetail.css';

const WorldviewDetail = () => {
  const { id } = useParams();
  // const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [worldview, setWorldview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorldview = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/worldviews/${id}`);
        const data = await res.json();
        
        if (res.status === 404) {
          navigate('/not-found');
          return;
        }
        
        setWorldview(data);
        setLoading(false);
      } catch (err) {
        console.error('获取世界观详情失败:', err);
        setLoading(false);
      }
    };

    fetchWorldview();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="text-center mt-5">加载中...</div>;
  }

  if (!worldview) {
    return <div className="text-center mt-5">世界观不存在</div>;
  }

  return (
    <div className="worldview-detail">
      <div className="worldview-header">
        <div className="worldview-number">编号: #{worldview.worldviewNumber}</div>
        <h1 className="worldview-title">{worldview.title}</h1>
        
        <div className="worldview-meta">
          <div className="author-info">
            <img 
              src={worldview.author?.avatar || 'https://picsum.photos/seed/avatar/40/40.jpg'} 
              alt="作者头像" 
              className="author-avatar"
            />
            <div>
              <div className="author-name">{worldview.author?.username || '未知作者'}</div>
              <div className="publish-date">发布于 {formatDate(worldview.createdAt)}</div>
            </div>
          </div>
          
          <div className="worldview-actions">
            <div className="view-count">
              👁 {worldview.views}
            </div>
          </div>
        </div>
        
        <div className="worldview-tags">
          <span className="category-tag">{worldview.category}</span>
          {worldview.tags && worldview.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      
      {worldview.coverImage && (
        <div className="worldview-cover">
          <img src={worldview.coverImage} alt={worldview.title} />
        </div>
      )}
      
      <div className="worldview-content">
        <div className="worldview-description">
          <h3>简介</h3>
          <p>{worldview.description}</p>
        </div>
        
        <div className="worldview-body">
          <ReactMarkdown>{worldview.content}</ReactMarkdown>
        </div>
      </div>
      
      <div className="worldview-footer">
        <div className="author-bio">
          <h3>关于作者</h3>
          <div className="author-card">
            <img 
              src={worldview.author?.avatar || 'https://picsum.photos/seed/avatar/60/60.jpg'} 
              alt="作者头像" 
              className="author-avatar-large"
            />
            <div className="author-details">
              <h4>{worldview.author?.username || '未知作者'}</h4>
              <p>{worldview.author?.bio || '这个用户很神秘，什么都没有留下...'}</p>
              <div className="author-id">作者ID: {worldview.author?.id}</div>
            </div>
          </div>
        </div>
      </div>
      
      <CommentSection worldviewId={id} />
    </div>
  );
};

export default WorldviewDetail;