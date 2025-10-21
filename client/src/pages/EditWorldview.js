import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import ReactMarkdown from 'react-markdown';
import CustomCSSInjector from '../components/CustomCSSInjector';
import './EditWorldview.css';

// 字数限制
const TITLE_MAX_LENGTH = 255;
const DESCRIPTION_MAX_LENGTH = 1000;

const EditWorldview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [worldview, setWorldview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    isPublic: true,
    customCSS: ''
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
          isPublic: data.isPublic !== false,
          customCSS: data.customCSS || ''
        });
        // 设置初始表单验证状态
        setIsFormValid(validateForm({
          title: data.title || '',
          description: data.description || '',
          content: data.content || '',
          isPublic: data.isPublic !== false
        }));
        
        // 延迟调整文本域高度，确保DOM已渲染
        setTimeout(() => {
          const contentTextarea = document.getElementById('content');
          if (contentTextarea) {
            contentTextarea.style.height = 'auto';
            contentTextarea.style.height = contentTextarea.scrollHeight + 'px';
          }
        }, 100);
        
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

  // 验证表单是否完整
  const validateForm = (data) => {
    const { title, description, content } = data || {};
    return title && title.trim() && 
           description && description.trim() && 
           content && content.trim();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // 更新表单验证状态
      setIsFormValid(validateForm(newData));
      
      return newData;
    });

    // 自动调整文本域高度
    if (name === 'content') {
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
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
            autoComplete="off"
            required
            maxLength={TITLE_MAX_LENGTH}
          />
          <div className={`character-count ${
            formData.title && formData.title.length > TITLE_MAX_LENGTH * 0.8 ? 'warning' : ''
          } ${
            formData.title && formData.title.length >= TITLE_MAX_LENGTH ? 'error' : ''
          }`}>
            {formData.title ? formData.title.length : 0}/{TITLE_MAX_LENGTH}
          </div>
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
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="简要描述您的世界观..."
          />
          <div className={`character-count ${
            formData.description && formData.description.length > DESCRIPTION_MAX_LENGTH * 0.8 ? 'warning' : ''
          } ${
            formData.description && formData.description.length >= DESCRIPTION_MAX_LENGTH ? 'error' : ''
          }`}>
            {formData.description ? formData.description.length : 0}/{DESCRIPTION_MAX_LENGTH}
          </div>
        </div>

        <div className="form-group">
          <div className="editor-header">
            <label htmlFor="content">详细内容</label>
            <button
              type="button"
              className={`preview-toggle ${showPreview ? 'active' : ''}`}
              onClick={() => {
                const newPreviewState = !showPreview;
                setShowPreview(newPreviewState);
                
                // 如果切换回编辑模式，调整输入框高度
                if (!newPreviewState) {
                  setTimeout(() => {
                    const contentTextarea = document.getElementById('content');
                    if (contentTextarea) {
                      contentTextarea.style.height = 'auto';
                      contentTextarea.style.height = contentTextarea.scrollHeight + 'px';
                    }
                  }, 100);
                }
              }}
            >
              {showPreview ? '编辑' : '预览'}
            </button>
          </div>
          
          {!showPreview ? (
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-control content-editor"
              rows="10"
              placeholder="详细描述您的世界观..."
            />
          ) : (
            <div className="preview-container">
              <ReactMarkdown className="markdown-preview">
                {formData.content || '*暂无内容*'}
              </ReactMarkdown>
            </div>
          )}
          <div className="editor-hint">
            支持Markdown格式，可以使用标题、列表、链接等格式化内容
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            公开可见（取消勾选后将创建为私有世界观，只有你自己能看到）
          </label>
        </div>

        <CustomCSSInjector 
          customCSS={formData.customCSS}
          onCSSChange={(css) => setFormData(prev => ({
            ...prev,
            customCSS: css
          }))}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !isFormValid}
          >
            {saving ? '保存中...' : '保存更改'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditWorldview;