import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest, API_ENDPOINTS } from '../utils/api';
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
    category: '其他',
    tags: '',
    coverImage: '',
    isPublic: true
  });
  
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['奇幻', '科幻', '现实', '历史', '神话', '其他'];

  const { title, description, content, category, tags, coverImage, isPublic } = formData || {};

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
      return newData;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.match('image.*')) {
      setErrors([{ msg: '请选择图片文件' }]);
      return;
    }
    
    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      setErrors([{ msg: '图片大小不能超过5MB' }]);
      return;
    }
    
    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // 上传图片
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    
    try {
      setUploading(true);
      const data = await apiRequest(API_ENDPOINTS.UPLOAD_IMAGE, {
        method: 'POST',
        body: uploadFormData,
        headers: {} // 不设置Content-Type，让浏览器自动设置multipart/form-data
      });
      
      setFormData(prev => ({
        ...prev,
        coverImage: data.imageUrl
      }));
      setErrors([]);
    } catch (err) {
      console.error('图片上传失败:', err);
      setErrors([{ msg: err.message || '图片上传失败' }]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      coverImage: ''
    }));
  };

  // 处理图片URL，确保相对路径可以正确显示
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // 如果是相对路径，添加服务器地址前缀
    return `http://localhost:5000${imagePath}`;
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
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
      
      const worldviewData = {
        title: title || '',
        description: description || '',
        content: content || '',
        category: category || '其他',
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        coverImage: coverImage || '',
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
          <label htmlFor="title">标题 <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={title || ''}
            onChange={onChange}
            className={`form-control ${errors.some(e => e.msg.includes('标题')) ? 'is-invalid' : ''}`}
            placeholder="给你的世界观起个名字"
            autoComplete="off"
            required
          />
          {errors.some(e => e.msg.includes('标题')) && (
            <div className="invalid-feedback">
              {errors.find(e => e.msg.includes('标题')).msg}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">简介 <span className="required">*</span></label>
          <textarea
            id="description"
            name="description"
            value={description || ''}
            onChange={onChange}
            className={`form-control ${errors.some(e => e.msg.includes('简介')) ? 'is-invalid' : ''}`}
            rows="3"
            placeholder="简要描述你的世界观"
            autoComplete="off"
            required
          ></textarea>
          {errors.some(e => e.msg.includes('简介')) && (
            <div className="invalid-feedback">
              {errors.find(e => e.msg.includes('简介')).msg}
            </div>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">分类</label>
            <div className="category-input-container">
              <input
                type="text"
                id="category"
                name="category"
                value={category || ''}
                onChange={onChange}
                className="form-control"
                placeholder="输入分类，如：奇幻、科幻、历史等"
                list="category-suggestions"
                autoComplete="off"
              />
              <datalist id="category-suggestions">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">标签</label>
            <input
            type="text"
            id="tags"
            name="tags"
            value={tags || ''}
            onChange={onChange}
            className="form-control"
            placeholder="用逗号分隔多个标签，如：魔法,冒险,中世纪"
            autoComplete="off"
          />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="coverImage">封面图片</label>
          <div className="image-upload-container">
            {(imagePreview || coverImage) ? (
              <div className="image-preview">
                <img src={imagePreview || getImageUrl(coverImage)} alt="封面预览" />
                <button type="button" className="remove-image-btn" onClick={removeImage}>
                  ×
                </button>
              </div>
            ) : (
              <div className="image-upload-area">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-upload-input"
                  disabled={uploading}
                />
                <label htmlFor="imageUpload" className="image-upload-label">
                  {uploading ? '上传中...' : '点击上传图片'}
                </label>
                <div className="upload-hint">支持 JPG、PNG、GIF 格式，大小不超过 5MB</div>
              </div>
            )}
          </div>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={coverImage}
            onChange={onChange}
            className="form-control"
            placeholder="或输入图片URL"
            autoComplete="off"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">内容 <span className="required">*</span></label>
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
            disabled={submitting}
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