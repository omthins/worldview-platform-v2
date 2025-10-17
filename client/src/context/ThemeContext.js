import React, { createContext, useContext, useEffect } from 'react';

// 创建上下文
const ThemeContext = createContext();

// 提供者组件
export const ThemeProvider = ({ children }) => {
  const isDarkMode = true; // 始终使用暗色模式

  // 应用主题到document
  useEffect(() => {
    document.documentElement.classList.add('dark-mode');
    document.documentElement.classList.remove('light-mode');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义Hook
export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;