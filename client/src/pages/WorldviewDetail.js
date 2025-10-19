import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
// import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, apiRequest } from '../utils/api';
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
        const data = await apiRequest(`${API_ENDPOINTS.WORLDVIEWS}/${id}`);
        
        setWorldview(data);
        setLoading(false);
      } catch (err) {
        console.error('获取世界观详情失败:', err);
        if (err.message === '世界观不存在') {
          navigate('/not-found');
        }
        setLoading(false);
      }
    };

    fetchWorldview();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };



  // 注入自定义CSS
  useEffect(() => {
    if (!worldview?.customCSS) return;
    
    // 创建style元素
    const styleElement = document.createElement('style');
    styleElement.id = `worldview-custom-css-${id}`;
    styleElement.textContent = worldview.customCSS;
    
    // 添加到head
    document.head.appendChild(styleElement);
    
    // 清理函数
    return () => {
      const existingStyle = document.getElementById(`worldview-custom-css-${id}`);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [worldview?.customCSS, id]);

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
                <Link to={`/profile/${worldview.author?.id}`} className="author-name">
                  {worldview.author?.username || '未知作者'}
                </Link>
                <div className="publish-date">发布于 {formatDate(worldview.createdAt)}</div>
              </div>
            </div>
          

        </div>
        

      </div>
      

      
      <div className="worldview-content">
        <div className="worldview-description">
          <h3>简介</h3>
          <p>{worldview.description}</p>
        </div>
        
        <div className="worldview-body">
          <ReactMarkdown>{worldview.content}</ReactMarkdown>
        </div>
      </div>
      

      
      <CommentSection worldviewId={id} />
    </div>
  );
};

export default WorldviewDetail;