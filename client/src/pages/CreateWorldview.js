import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest, API_ENDPOINTS } from '../utils/api';
import ReactMarkdown from 'react-markdown';
import './CreateWorldview.css';

const CreateWorldview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 检查用户是否已登录
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    isPublic: true
  });
  
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { title, description, content, isPublic } = formData || {};

  // 字数限制
  const TITLE_MAX_LENGTH = 255;
  const DESCRIPTION_MAX_LENGTH = 1000;

  // 初始化表单验证状态
  React.useEffect(() => {
    setIsFormValid(validateForm(formData));
  }, []);

  // 验证表单是否完整
  const validateForm = (data) => {
    const { title, description, content } = data || {};
    return title && title.trim() && 
           description && description.trim() && 
           content && content.trim();
  };

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    console.log('表单字段变化:', { name, value, type, checked });
    setFormData(prev => {
      const currentData = prev || {};
      const newData = {
        ...currentData,
        [name]: type === 'checkbox' ? checked : value
      };
      console.log('更新后的表单数据:', newData);
      
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



  const onSubmit = async e => {
    e.preventDefault();
    
    // 确保formData存在且包含所有必要字段
    const safeFormData = formData || {};
    const { title, description, content } = safeFormData;
    
    // 调试代码：打印表单值
    console.log('表单提交时的值:', { title, description, content });
    
    // 清除之前的错误
    setErrors([]);
    
    // 验证必填字段
    const newErrors = [];
    if (!title || !title.trim()) {
      console.log('标题验证失败:', title);
      newErrors.push({ msg: '标题是必填字段，请填写标题' });
    }
    if (!description || !description.trim()) {
      console.log('简介验证失败:', description);
      newErrors.push({ msg: '简介是必填字段，请填写简介' });
    }
    if (!content || !content.trim()) {
      console.log('内容验证失败:', content);
      newErrors.push({ msg: '内容是必填字段，请填写内容' });
    }
    
    // 如果有错误，显示并返回
    if (newErrors.length > 0) {
      console.log('验证错误:', newErrors);
      setErrors(newErrors);
      return;
    }
    
    setSubmitting(true);
    setSuccessMessage('');
    
    try {
      const worldviewData = {
        title: title || '',
        description: description || '',
        content: content || '',
        isPublic: isPublic !== undefined ? isPublic : true
      };
      
      const data = await apiRequest(API_ENDPOINTS.WORLDVIEWS, {
        method: 'POST',
        body: JSON.stringify(worldviewData)
      });
      
      // 设置成功消息
      setSuccessMessage(isPublic ? '世界观发布成功！' : '世界观创建成功！');
      
      // 短暂延迟后跳转
      setTimeout(() => {
        navigate(`/worldview/${data.id}`);
      }, 1500);
    } catch (err) {
      console.error('发布世界观失败:', err);
      
      // 处理后端返回的验证错误
      if (err.message && typeof err.message === 'string') {
        try {
          // 尝试解析JSON格式的错误信息
          const errorData = JSON.parse(err.message);
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // 如果是验证错误数组，显示每个错误
            setErrors(errorData.errors.map(e => ({ msg: e.msg || e.message })));
          } else {
            setErrors([{ msg: errorData.message || err.message }]);
          }
        } catch (parseErr) {
          // 如果不是JSON格式，直接显示错误信息
          setErrors([{ msg: err.message }]);
        }
      } else if (err.errors && Array.isArray(err.errors)) {
        // 如果是错误数组，显示每个错误
        setErrors(err.errors.map(e => ({ msg: e.msg || e.message })));
      } else {
        // 默认错误信息
        setErrors([{ msg: err.message || '发布世界观失败' }]);
      }
      
      setSubmitting(false);
    }
  };

  return (
    <div className="create-worldview">
      <div className="create-header">
        <h1>发布世界观</h1>
        <p>分享你的创意世界</p>
      </div>
      
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((error, index) => (
            <div key={index}>{error.msg}</div>
          ))}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="title">标题</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title || ''}
            onChange={onChange}
            className={`form-control ${errors.some(e => e.msg.includes('标题')) ? 'is-invalid' : ''}`}
            placeholder="给你的世界观起个名字"
            autoComplete="off"
            maxLength={TITLE_MAX_LENGTH}
            required
          />
          <div className={`character-count ${
            title && title.length > TITLE_MAX_LENGTH * 0.8 ? 'warning' : ''
          } ${
            title && title.length >= TITLE_MAX_LENGTH ? 'error' : ''
          }`}>
            {title ? title.length : 0}/{TITLE_MAX_LENGTH}
          </div>
          {errors.some(e => e.msg.includes('标题')) && (
            <div className="invalid-feedback">
              {errors.find(e => e.msg.includes('标题')).msg}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">简介</label>
          <textarea
            id="description"
            name="description"
            value={description || ''}
            onChange={onChange}
            className={`form-control ${errors.some(e => e.msg.includes('简介')) ? 'is-invalid' : ''}`}
            rows="3"
            placeholder="简要描述你的世界观"
            autoComplete="off"
            maxLength={DESCRIPTION_MAX_LENGTH}
            required
          ></textarea>
          <div className={`character-count ${
            description && description.length > DESCRIPTION_MAX_LENGTH * 0.8 ? 'warning' : ''
          } ${
            description && description.length >= DESCRIPTION_MAX_LENGTH ? 'error' : ''
          }`}>
            {description ? description.length : 0}/{DESCRIPTION_MAX_LENGTH}
          </div>
          {errors.some(e => e.msg.includes('简介')) && (
            <div className="invalid-feedback">
              {errors.find(e => e.msg.includes('简介')).msg}
            </div>
          )}
        </div>
        

        

        
        <div className="form-group">
          <div className="editor-header">
            <label htmlFor="content">内容</label>
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
              value={content || ''}
              onChange={onChange}
              className={`form-control content-editor ${errors.some(e => e.msg.includes('内容')) ? 'is-invalid' : ''}`}
              rows="15"
              placeholder="在这里详细描述你的世界观，支持Markdown格式..."
              autoComplete="off"
              required
            ></textarea>
          ) : (
            <div className="preview-container">
              <ReactMarkdown className="markdown-preview">
                {content || '*暂无内容*'}
              </ReactMarkdown>
            </div>
          )}
          
          {errors.some(e => e.msg.includes('内容')) && (
            <div className="invalid-feedback">
              {errors.find(e => e.msg.includes('内容')).msg}
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
              checked={isPublic}
              onChange={onChange}
            />
            公开发布（取消勾选后将创建为私有世界观，只有你自己能看到）
          </label>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !isFormValid}
          >
            {submitting ? '处理中...' : (isPublic ? '发布世界观' : '创建世界观')}
          </button>
          
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/dashboard')}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorldview;