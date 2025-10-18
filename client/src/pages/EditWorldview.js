import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import './EditWorldview.css';

const EditWorldview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [worldview, setWorldview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    isPublic: true
  });

  useEffect(() => {
    const fetchWorldview = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/worldviews/${id}`);
        
        // 检查用户是否有权限编辑这个世界观
        if (data.authorId !== user.id) {
          setError('您没有权限编辑这个世界观');
          setLoading(false);
          return;
        }
        
        setWorldview(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          content: data.content || '',
          isPublic: data.isPublic !== false
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || '获取世界观失败');
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchWorldview();
  }, [id, isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/worldviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      setMessage('世界观更新成功！');
      setTimeout(() => {
        navigate(`/worldview/${id}`);
      }, 1000);
    } catch (err) {
      setError(err.message || '更新失败，请重试');
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="edit-worldview-page">
        <div className="container">
          <div className="text-center mt-5">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-worldview-page">
        <div className="container">
          <div className="alert alert-danger mt-5">{error}</div>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  if (!worldview) {
    return (
      <div className="edit-worldview-page">
        <div className="container">
          <div className="alert alert-danger mt-5">世界观不存在</div>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-worldview-page">
      <div className="container">
        <div className="page-header">
          <h1>编辑世界观</h1>
          <p>修改您的世界观内容</p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-worldview-form">
          <div className="form-group">
            <label htmlFor="title">标题</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
              maxLength="200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">简介</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              maxLength="500"
              placeholder="简要描述您的世界观..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">详细内容</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-control"
              rows="10"
              placeholder="详细描述您的世界观..."
            />
          </div>



          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="isPublic" className="form-check-label">
                公开可见
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              取消
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorldview;