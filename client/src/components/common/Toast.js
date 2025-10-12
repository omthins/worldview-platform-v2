import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400); // 给动画足够时间完成
    }, duration);

    // 进度条动画
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast ${type} ${visible ? 'show' : 'hide'}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={() => {
          setVisible(false);
          setTimeout(onClose, 400);
        }}>×</button>
      </div>
      <div className="toast-progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default Toast;