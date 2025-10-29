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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e, searchType = '', searchTerm = '') => {
    // 支持从按钮或程序调用，e 可能为 undefined
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const term = searchTerm || searchQuery.trim();
    if (term) {
      // 立即去除模糊效果
      setSearchFocused(false);
      document.body.classList.remove('search-blur');
      
      // 清空搜索框并移除焦点
      setSearchQuery('');
      setSearchSuggestions([]);
  setHighlightedIndex(-1);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
      
      let searchUrl = '/?search=';
      if (searchType) {
        searchUrl = `/?${searchType}=${encodeURIComponent(term)}`;
      } else {
        // 直接点击搜索按钮时，使用综合搜索
        searchUrl += encodeURIComponent(term);
      }
      navigate(searchUrl);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setHighlightedIndex(-1);
    
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

  const handleKeyDown = (e) => {
    if (!searchSuggestions || searchSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((idx) => Math.min(searchSuggestions.length - 1, idx + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((idx) => Math.max(-1, idx - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && searchSuggestions[highlightedIndex]) {
        e.preventDefault();
        const s = searchSuggestions[highlightedIndex];
        handleSearch(e, s.type, s.term);
      }
      // 否则，允许表单 submit 处理普通搜索（handleSearch onSubmit 会触发）
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
      setSearchSuggestions([]);
      setHighlightedIndex(-1);
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

  // 点击空白处关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownElement = document.querySelector('.dropdown');
      if (dropdownOpen && dropdownElement && !dropdownElement.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
              <span className="search-icon" aria-hidden="true">
                {/* SVG 放大镜图标 */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19a8 8 0 1 1 5.293-14.293A8 8 0 0 1 11 19zm0 2a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" fill="currentColor" opacity="0.15"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="text"
                aria-label="搜索"
                placeholder="搜索世界观、作者名、世界编号、作者ID..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={searchFocused && searchSuggestions.length > 0}
                aria-controls="navbar-search-listbox"
                className="search-input"
                ref={searchInputRef}
              />
              <button
                type="button"
                className="search-btn"
                aria-label="执行搜索"
                title="搜索"
                onClick={(ev) => {
                  if (highlightedIndex >= 0 && searchSuggestions[highlightedIndex]) {
                    const s = searchSuggestions[highlightedIndex];
                    handleSearch(ev, s.type, s.term);
                  } else {
                    handleSearch(ev);
                  }
                }}
                disabled={!(searchQuery.trim() || highlightedIndex >= 0)}
              >
                <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="btn-text">搜索</span>
              </button>
            {searchFocused && searchSuggestions.length > 0 && (
                <div className="search-suggestions" role="listbox" id="navbar-search-listbox">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      role="option"
                      aria-selected={highlightedIndex === index}
                      className={"search-suggestion-item" + (highlightedIndex === index ? ' active' : '')}
                      onMouseDown={(e) => handleSearch(e, suggestion.type, suggestion.term)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="item-icon">{/* 占位图标 */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                        </svg>
                      </div>
                      <div className="item-text">{suggestion.label}</div>
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