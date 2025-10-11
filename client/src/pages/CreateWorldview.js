import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import './CreateWorldview.css';

const CreateWorldview = () => {
  // const { user } = useAuth();
  const navigate = useNavigate();
  
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
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['奇幻', '科幻', '现实', '历史', '神话', '其他'];

  const { title, description, content, category, tags, coverImage, isPublic } = formData;

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploading(true);
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setFormData({
          ...formData,
          coverImage: data.imageUrl
        });
        setErrors([]);
      } else {
        setErrors(data.errors || [{ msg: '图片上传失败' }]);
      }
    } catch (err) {
      console.error('图片上传失败:', err);
      setErrors([{ msg: '图片上传失败，请稍后再试' }]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({
      ...formData,
      coverImage: ''
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!title || !description || !content) {
      setErrors([{ msg: '请填写所有必填字段' }]);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
      
      const res = await fetch('/api/worldviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          content,
          category,
          tags: tagsArray,
          coverImage,
          isPublic
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        navigate(`/worldview/${data.id}`);
      } else {
        setErrors(data.errors || [{ msg: '创建世界观失败' }]);
        setSubmitting(false);
      }
    } catch (err) {
      console.error('创建世界观失败:', err);
      setErrors([{ msg: '服务器错误，请稍后再试' }]);
      setSubmitting(false);
    }
  };

  return (
    <div className="create-worldview">
      <div className="create-header">
        <h1>创建世界观</h1>
        <p>分享你的创意世界</p>
      </div>
      
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((error, index) => (
            <div key={index}>{error.msg}</div>
          ))}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="title">标题 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            className="form-control"
            placeholder="给你的世界观起个名字"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">简介 *</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            className="form-control"
            rows="3"
            placeholder="简要描述你的世界观"
            required
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">分类</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={onChange}
              className="form-control"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">标签</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tags}
              onChange={onChange}
              className="form-control"
              placeholder="用逗号分隔多个标签"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="coverImage">封面图片</label>
          <div className="image-upload-container">
            {(imagePreview || coverImage) ? (
              <div className="image-preview">
                <img src={imagePreview || coverImage} alt="封面预览" />
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
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">内容 *</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            className="form-control content-editor"
            rows="15"
            placeholder="在这里详细描述你的世界观，支持Markdown格式..."
            required
          ></textarea>
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
            公开发布（取消后将只有你自己能看到）
          </label>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? '创建中...' : '创建世界观'}
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