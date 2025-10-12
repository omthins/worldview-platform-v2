const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  WORLDVIEWS: `${API_BASE_URL}/api/worldviews`,
  AUTH: `${API_BASE_URL}/api/auth`,
  USERS: `${API_BASE_URL}/api/users`,
  COMMENTS: `${API_BASE_URL}/api/comments`,
  UPLOAD: `${API_BASE_URL}/api/upload`
};

export const apiRequest = async (url, options = {}) => {
  console.log('API Request URL:', url);
  
  // 如果URL是相对路径，添加基础URL
  if (url.startsWith('/')) {
    url = `${API_BASE_URL}${url}`;
  }
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // 如果有token，添加到请求头
  const token = localStorage.getItem('token');
  if (token) {
    mergedOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log('Sending request with options:', mergedOptions);
    const response = await fetch(url, mergedOptions);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // 检查响应是否为JSON
    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('Response text (first 200 chars):', text.substring(0, 200));
      throw new Error(`Expected JSON response but got ${contentType}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};