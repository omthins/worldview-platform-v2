import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

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

// 设置请求头
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Provider 组件
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 加载用户
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth/me');
      dispatch({
        type: USER_LOADED,
        payload: res.data
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
      const res = await axios.post('/api/auth/register', formData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data
      });
      setAuthToken(res.data.token);
      return { success: true };
    } catch (err) {
      dispatch({
        type: AUTH_FAILURE
      });
      return { 
        success: false, 
        errors: err.response?.data?.errors || [{ msg: '注册失败' }] 
      };
    }
  };

  // 登录
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data
      });
      setAuthToken(res.data.token);
      return { success: true };
    } catch (err) {
      dispatch({
        type: AUTH_FAILURE
      });
      return { 
        success: false, 
        errors: err.response?.data?.errors || [{ msg: '登录失败' }] 
      };
    }
  };

  // 登出
  const logout = () => {
    dispatch({
      type: LOGOUT
    });
    setAuthToken(null);
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