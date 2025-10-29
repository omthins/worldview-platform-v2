import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(result.errors);
      setShowModal(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">登录</h1>
        
        <form onSubmit={onSubmit}>
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
          
          <button type="submit" className="btn btn-primary btn-block" disabled={!email || !password || loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>还没有账号？ <Link to="/register">注册</Link></p>
        </div>
      </div>
      
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="登录失败"
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

export default Login;