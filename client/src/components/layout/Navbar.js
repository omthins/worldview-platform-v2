import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const authLinks = (
    <>
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">控制台</Link>
      </li>
      <li className="nav-item">
        <Link to="/create-worldview" className="nav-link">创建世界观</Link>
      </li>
      <li className="nav-item dropdown">
        <button 
          className="nav-link dropdown-toggle" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img 
            src={user?.avatar || 'https://picsum.photos/seed/avatar/30/30.jpg'} 
            alt="用户头像" 
            className="avatar"
          />
          {user?.username}
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to={`/profile/${user?.id}`} className="dropdown-item">查看我的资料</Link>
            <Link to="/profile" className="dropdown-item">编辑我的资料</Link>
            <button onClick={onLogout} className="dropdown-item">退出登录</button>
          </div>
        )}
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link to="/register" className="nav-link">注册</Link>
      </li>
      <li className="nav-item">
        <Link to="/login" className="nav-link">登录</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          幻境界
        </Link>
        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="text"
            placeholder="搜索世界观、作者名、世界编号、作者ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">搜索</button>
        </form>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">首页</Link>
          </li>
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;