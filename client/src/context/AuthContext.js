import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

// 创建上下文
const AuthContext = createContext();

// 初始状态
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: true
};

// Action 类型
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
  const USER_LOADED = 'USER_LOADED';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    case AUTH_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    case AUTH_FAILURE:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      };
    default:
      return state;
  }
};

// Provider 组件
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 加载用户
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({
        type: AUTH_FAILURE
      });
      return;
    }

    try {
      const res = await apiRequest(`${API_ENDPOINTS.AUTH}/me`);
      dispatch({
        type: USER_LOADED,
        payload: res
      });
    } catch (err) {
      dispatch({
        type: AUTH_FAILURE
      });
    }
  };

  // 注册
  const register = async (formData) => {
    try {
      const res = await apiRequest(`${API_ENDPOINTS.AUTH}/register`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      dispatch({
        type: AUTH_SUCCESS,
        payload: res
      });
      return { success: true };
    } catch (err) {
      dispatch({
        type: AUTH_FAILURE
      });
      
      // 处理新的错误格式
      const errorData = err.response?.data;
      let errors = [];
      
      if (errorData?.details && Array.isArray(errorData.details)) {
        errors = errorData.details.map(detail => ({ msg: detail }));
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        errors = errorData.errors.map(error => ({ msg: error.msg || error }));
      } else if (errorData?.message) {
        errors = [{ msg: errorData.message }];
      } else {
        errors = [{ msg: '注册失败，请检查网络连接或稍后重试' }];
      }
      
      return { 
        success: false, 
        errors 
      };
    }
  };

  // 登录
  const login = async (formData) => {
    try {
      const res = await apiRequest(`${API_ENDPOINTS.AUTH}/login`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      dispatch({
        type: AUTH_SUCCESS,
        payload: res
      });
      return { success: true };
    } catch (err) {
      dispatch({
        type: AUTH_FAILURE
      });
      
      // 处理新的错误格式
      const errorData = err.response?.data;
      let errors = [];
      
      if (errorData?.details && Array.isArray(errorData.details)) {
        errors = errorData.details.map(detail => ({ msg: detail }));
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        errors = errorData.errors.map(error => ({ msg: error.msg || error }));
      } else if (errorData?.message) {
        errors = [{ msg: errorData.message }];
      } else {
        errors = [{ msg: '登录失败，请检查网络连接或稍后重试' }];
      }
      
      return { 
        success: false, 
        errors 
      };
    }
  };

  // 登出
  const logout = () => {
    dispatch({
      type: LOGOUT
    });
  };

  // 更新用户信息
  const updateUser = (userData) => {
    dispatch({
      type: USER_LOADED,
      payload: userData
    });
  };

  // 初始化
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自定义 Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;