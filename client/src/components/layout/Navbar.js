import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e, searchType = '', searchTerm = '') => {
    e.preventDefault();
    const term = searchTerm || searchQuery.trim();
    if (term) {
      // 立即去除模糊效果
      setSearchFocused(false);
      document.body.classList.remove('search-blur');
      
      // 清空搜索框并移除焦点
      setSearchQuery('');
      setSearchSuggestions([]);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
      
      let searchUrl = '/?search=';
      if (searchType) {
        searchUrl = `/?${searchType}=${encodeURIComponent(term)}`;
      } else {
        searchUrl += encodeURIComponent(term);
      }
      navigate(searchUrl);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const suggestions = [
        { type: 'worldview', label: `搜索世界观: ${value}`, term: value },
        { type: 'creator', label: `搜索创作者: ${value}`, term: value },
        { type: 'id', label: `搜索UUID: ${value}`, term: value },
        { type: 'wid', label: `搜索编号: ${value}`, term: value }
      ];
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSearchInputFocus = () => {
    setSearchFocused(true);
    document.body.classList.add('search-blur');
  };

  const handleSearchInputBlur = () => {
    // 延迟关闭，以便点击建议项
    setTimeout(() => {
      setSearchFocused(false);
      document.body.classList.remove('search-blur');
    }, 200);
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('search-blur');
    };
  }, []);

  const authLinks = (
    <>
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">个人中心</Link>
      </li>
      <li className="nav-item">
        <Link to="/create-worldview" className="nav-link">发布世界观</Link>
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
          <div className="search-container">
            <input
              type="text"
              placeholder="搜索世界观、作者名、世界编号、作者ID..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
              className="search-input"
              ref={searchInputRef}
            />
            <button type="submit" className="search-btn">搜索</button>
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="search-suggestion-item"
                    onMouseDown={(e) => handleSearch(e, suggestion.type, suggestion.term)}
                  >
                    {suggestion.label}
                  </div>
                ))}
              </div>
            )}
          </div>
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