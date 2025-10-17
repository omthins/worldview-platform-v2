import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 服务器返回了错误状态码
      if (error.response.status === 401) {
        // 未授权，清除token并重定向到登录页
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// 投票相关API
export const pollAPI = {
  getAllPolls: () => api.get('/polls'),
  getPollById: (id) => api.get(`/polls/${id}`),
  createPoll: (pollData) => api.post('/polls', pollData),
  vote: (pollId, optionId) => api.post(`/polls/${pollId}/vote`, { optionId }),
  getPollResults: (id) => api.get(`/polls/${id}/results`)
};

// 导出单独的投票API函数，以便在组件中直接使用
export const getPolls = () => api.get('/polls');
export const getPollById = (id) => api.get(`/polls/${id}`);
export const createPoll = (pollData) => api.post('/polls', pollData);
export const voteOnPoll = (pollId, optionId) => api.post(`/polls/${pollId}/vote`, { selectedOption: optionId });
export const getPollResults = (id) => api.get(`/polls/${id}/results`);

// 评论相关API
export const commentAPI = {
  getComments: (pollId) => api.get(`/polls/${pollId}/comments`),
  addComment: (pollId, content) => api.post(`/polls/${pollId}/comments`, { content })
};

// 导出单独的评论API函数
export const getComments = (pollId) => api.get(`/polls/${pollId}/comments`);
export const addComment = (pollId, content) => api.post(`/polls/${pollId}/comments`, { content });

// 通知相关API
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  archiveNotification: (id) => api.put(`/notifications/${id}/archive`),
  getUnreadCount: () => api.get('/notifications/unread-count')
};

// 聊天相关API
export const chatAPI = {
  createRoom: (data) => api.post('/chat/rooms', data),
  getRooms: () => api.get('/chat/rooms'),
  getRoomMessages: (roomId, params) => api.get(`/chat/rooms/${roomId}/messages`, { params }),
  sendMessage: (roomId, content) => api.post(`/chat/rooms/${roomId}/messages`, { content })
};

// 社交分享相关API
export const shareAPI = {
  shareWorldview: (worldviewId, platform) => api.post(`/worldviews/${worldviewId}/share`, { platform }),
  sharePoll: (pollId, platform) => api.post(`/polls/${pollId}/share`, { platform })
};

export default api;