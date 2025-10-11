import React, { useState, useRef } from 'react';
import './AvatarUpload.css';

const AvatarUpload = ({ currentAvatar, onAvatarChange }) => {
  const [preview, setPreview] = useState(currentAvatar || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    setError('');
    
    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // 上传图片
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        onAvatarChange(data.avatarUrl);
        setError('');
      } else {
        setError(data.message || '上传失败');
        // 恢复原始预览
        setPreview(currentAvatar || '');
      }
    } catch (err) {
      console.error('上传头像失败:', err);
      setError('上传失败，请重试');
      // 恢复原始预览
      setPreview(currentAvatar || '');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveAvatar = () => {
    setPreview('');
    onAvatarChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-preview-container">
        <div 
          className={`avatar-preview ${uploading ? 'uploading' : ''}`}
          onClick={handleClick}
        >
          {preview ? (
            <img src={preview} alt="头像预览" />
          ) : (
            <div className="avatar-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>点击上传头像</span>
            </div>
          )}
          {uploading && (
            <div className="upload-overlay">
              <div className="spinner"></div>
              <span>上传中...</span>
            </div>
          )}
        </div>
        {preview && (
          <button 
            type="button" 
            className="remove-avatar-btn"
            onClick={handleRemoveAvatar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {error && <div className="avatar-error">{error}</div>}
      
      <div className="avatar-upload-info">
        <p>支持 JPG、PNG、GIF 格式，文件大小不超过 5MB</p>
        <p>点击头像可重新上传</p>
      </div>
    </div>
  );
};

export default AvatarUpload;