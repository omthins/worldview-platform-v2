import React, { useState } from 'react';
import './DefaultAvatarSelector.css';

const DefaultAvatarSelector = ({ onAvatarSelect, currentAvatar = '' }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  // 预设头像选项 - 包括用户提供的SVG和其他选项
  const defaultAvatars = [
    {
      id: 'purple-abstract',
      name: '抽象紫色',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#8a5cf6"/>
        <path d="M50 30 L60 50 L50 70 L40 50 Z" fill="white"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="5" opacity="0.1"/>
      </svg>`
    },
    {
      id: 'blue-gradient',
      name: '蓝色渐变',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4f46e5"/>
            <stop offset="100%" stop-color="#7c3aed"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#blueGradient)"/>
        <circle cx="50" cy="50" r="15" fill="white" opacity="0.8"/>
      </svg>`
    },
    {
      id: 'green-nature',
      name: '自然绿色',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#10b981"/>
        <path d="M35 40 Q50 30 65 40 Q60 60 50 65 Q40 60 35 40" fill="white" opacity="0.9"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="3" opacity="0.2"/>
      </svg>`
    },
    {
      id: 'orange-warm',
      name: '温暖橙色',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#f59e0b"/>
        <rect x="35" y="35" width="30" height="30" rx="5" fill="white" opacity="0.9"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="3" opacity="0.2"/>
      </svg>`
    },
    {
      id: 'pink-soft',
      name: '柔和粉色',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#ec4899"/>
        <polygon points="50,30 60,50 50,70 40,50" fill="white" opacity="0.9"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="3" opacity="0.2"/>
      </svg>`
    },
    {
      id: 'teal-modern',
      name: '现代青色',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#14b8a6"/>
        <path d="M40 40 L60 40 L50 65 Z" fill="white" opacity="0.9"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="3" opacity="0.2"/>
      </svg>`
    }
  ];

  const handleAvatarSelect = (avatar) => {
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(avatar.svg)}`;
    setSelectedAvatar(svgDataUrl);
    onAvatarSelect(svgDataUrl);
  };

  const handleCustomUpload = () => {
    // 触发文件上传
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          setSelectedAvatar(imageUrl);
          onAvatarSelect(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <div className="default-avatar-selector">
      <div className="avatar-selector-header">
        <h4>选择头像</h4>
        <p>从预设头像中选择或上传自定义头像</p>
      </div>
      
      <div className="avatar-grid">
        {defaultAvatars.map((avatar) => (
          <div 
            key={avatar.id}
            className={`avatar-option ${selectedAvatar.includes(avatar.id) ? 'selected' : ''}`}
            onClick={() => handleAvatarSelect(avatar)}
            title={avatar.name}
          >
            <div 
              className="avatar-svg"
              dangerouslySetInnerHTML={{ __html: avatar.svg }}
            />
          </div>
        ))}
        
        <div 
          className="avatar-option custom-upload"
          onClick={handleCustomUpload}
          title="上传自定义头像"
        >
          <div className="custom-upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>上传</span>
          </div>
        </div>
      </div>
      
      {selectedAvatar && (
        <div className="selected-avatar-preview">
          <h5>当前选择:</h5>
          <img src={selectedAvatar} alt="已选头像" className="preview-image" />
        </div>
      )}
    </div>
  );
};

export default DefaultAvatarSelector;