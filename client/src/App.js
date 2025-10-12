import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import WorldviewDetail from './pages/WorldviewDetail';
import CreateWorldview from './pages/CreateWorldview';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import { initTouchOptimizations, addRippleToButtons } from './utils/touch';
import './App.css';

// 私有路由组件
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">加载中...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 公共路由组件（已登录用户不能访问）
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">加载中...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  useEffect(() => {
    // 初始化触屏优化
    initTouchOptimizations();
    
    // 添加按钮波纹效果
    addRippleToButtons();
    
    // 监听路由变化，为新加载的内容添加波纹效果
    const observer = new MutationObserver(() => {
      addRippleToButtons();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ToastProvider>
      <div className="App">
        <Navbar />
        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/create-worldview" 
                element={
                  <PrivateRoute>
                    <CreateWorldview />
                  </PrivateRoute>
                } 
              />
              <Route path="/worldview/:id" element={<WorldviewDetail />} />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route path="/profile/:id" element={<UserProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;