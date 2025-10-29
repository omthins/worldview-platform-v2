import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import DefaultAvatarSelector from '../../components/DefaultAvatarSelector';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    avatar: ''
  });
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const { username, email, password, password2, avatar } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarSelect = (avatarUrl) => {
    setFormData({ ...formData, avatar: avatarUrl });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setErrors([{ msg: '密码不匹配' }]);
      setShowModal(true);
      return;
    }
    
    // 强制用户选择头像
    if (!avatar) {
      setErrors([{ msg: '请选择一个头像' }]);
      setShowModal(true);
      return;
    }
    
    setLoading(true);
    const result = await register({ username, email, password, avatar });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(result.errors);
      setShowModal(true);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">注册</h1>
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              className="form-control"
              autoComplete="off"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-control"
              autoComplete="off"
              required
            />
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password">密码</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="form-control"
                autoComplete="off"
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)} aria-label="切换密码可见性">
                {showPassword ? '隐藏' : '显示'}
              </button>
            </div>
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password2">确认密码</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                className="form-control"
                autoComplete="off"
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)} aria-label="切换密码可见性">
                {showPassword ? '隐藏' : '显示'}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>选择头像</label>
            <DefaultAvatarSelector 
              onAvatarSelect={handleAvatarSelect}
              currentAvatar={avatar}
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={!username || !email || !password || !password2 || loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>已有账号？ <Link to="/login">登录</Link></p>
        </div>
      </div>
      
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="注册失败"
      >
        <div className="error-list">
          {errors.map((error, index) => (
            <div key={index} className="error-item">{error.msg}</div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Register;