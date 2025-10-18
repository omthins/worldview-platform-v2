import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import PageTransition from './components/common/PageTransition';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import WorldviewDetail from './pages/WorldviewDetail';
import CreateWorldview from './pages/CreateWorldview';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import EditWorldview from './pages/EditWorldview';


import Chat from './pages/Chat';
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
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="App">
          <Navbar />
          <main>
            <div className="container">
              <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <PageTransition><Login /></PageTransition>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <PageTransition><Register /></PageTransition>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <PageTransition><Dashboard /></PageTransition>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/create-worldview" 
                element={
                  <PrivateRoute>
                    <PageTransition><CreateWorldview /></PageTransition>
                  </PrivateRoute>
                } 
              />
              <Route path="/worldview/:id" element={<PageTransition><WorldviewDetail /></PageTransition>} />
              <Route 
                path="/edit-worldview/:id" 
                element={
                  <PrivateRoute>
                    <PageTransition><EditWorldview /></PageTransition>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <PageTransition><Profile /></PageTransition>
                  </PrivateRoute>
                } 
              />
              <Route path="/profile/:id" element={<PageTransition><UserProfile /></PageTransition>} />


              <Route 
                path="/chat" 
                element={
                  <PrivateRoute>
                    <PageTransition><Chat /></PageTransition>
                  </PrivateRoute>
                } 
              />
              </Routes>
            </div>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;