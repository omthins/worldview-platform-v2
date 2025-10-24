import React, { useState, useEffect, useRef } from 'react';
import './CustomCSSInjector.css';

const CustomCSSInjector = ({ 
  customCSS = '', 
  onCSSChange = () => {},
  showPresets = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [isValidCSS, setIsValidCSS] = useState(true);
  const [cssError, setCSSError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [copyType, setCopyType] = useState(''); // 'current' 或 'default'
  const [selectedPreset, setSelectedPreset] = useState('默认样式'); // 用于跟踪当前选中的预设样式
  // 使用selectedPreset来控制CSS编辑器的显示状态和按钮的激活状态
  void selectedPreset; // 告诉ESLint这个变量是有意使用的
  
  // 添加文本区域的引用
  const textareaRef = useRef(null);

  // 预设样式选项
  const presetStyles = [
    {
      name: '默认样式',
      value: '',
      description: '使用系统默认样式'
    },
    {
      name: '简约现代',
      value: `/* 简约现代风格 - 优化版 */
.worldview-detail {
  background: #1a1a1a;
  color: #ffffff;
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  border: 1px solid #333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.worldview-header {
  background: #2d2d2d;
  border-bottom: 3px solid #3498db;
  padding: 2.5rem;
  margin-bottom: 2rem;
}

.worldview-title {
  color: #ffffff;
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
}

.worldview-content {
  background: #2d2d2d;
  border-radius: 6px;
  padding: 2rem;
  margin: 2rem 0;
}

.worldview-body {
  line-height: 1.7;
  font-size: 1.1rem;
  color: #e0e0e0;
}

.worldview-body p {
  margin-bottom: 1.5rem;
}

.worldview-body h1 {
  color: #64ffda;
  border-bottom: 2px solid rgba(100, 255, 218, 0.3);
  padding-bottom: 0.8rem;
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
  font-weight: 600;
}

.worldview-body h2 {
  color: #4fc3f7;
  margin: 2rem 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 500;
}

.worldview-body h3 {
  color: #81d4fa;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 500;
}

.worldview-body strong {
  color: #3498db;
  font-weight: 600;
}

.worldview-body em {
  color: #bdbdbd;
  font-style: italic;
}

.worldview-body code {
  background: #333;
  color: #64ffda;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}`,
      description: '极简深色设计，干净利落的现代风格'
    },
    {
      name: 'WinUI3风格',
      value: `/* 全局基础设置 */
:root {
  --primary-color: #0078D7;
  --primary-hover-color: #106EBE;
  --text-color: rgba(255, 255, 255, 0.92);
  --text-secondary-color: rgba(255, 255, 255, 0.6);
  --border-color: rgba(255, 255, 255, 0.08);
  --card-bg-color: rgba(32, 32, 32, 0.48);
  --tag-bg-color: rgba(0, 120, 215, 0.12);
  --form-bg-color: rgba(20, 20, 20, 0.64);
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

/* 根治背景闪烁问题 */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body {
  background: 
    linear-gradient(to bottom, #1A1A1A 0%, #0D0D0D 100%) fixed,
    radial-gradient(circle at 20% 30%, rgba(0, 120, 215, 0.15) 0%, transparent 40%) fixed,
    radial-gradient(circle at 80% 70%, rgba(0, 120, 215, 0.1) 0%, transparent 40%) fixed;
  background-attachment: fixed;
  min-height: 100vh;
  font-family: 'Segoe UI Variable', system-ui, -apple-system, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
}

/* 防白边保险层 */
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  z-index: -2;
}

/* 主内容容器 */
.worldview-detail {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

/* 极简标题区 */
.worldview-header {
  margin-bottom: 2.5rem;
}

.worldview-number {
  font-size: 0.85rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
}

.worldview-title {
  font-size: 2.2rem;
  margin: 0 0 1rem;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.015em;
}

/* 超精简元信息 */
.worldview-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 1.25rem 0;
  font-size: 0.85rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-color);
}

.publish-date {
  color: var(--text-secondary-color);
}

/* 极简标签系统 */
.worldview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--tag-bg-color);
  color: var(--primary-color);
  border: 1px solid rgba(0, 120, 215, 0.2);
}

/* WinUI3风格内容卡片 */
.worldview-content {
  background-color: var(--card-bg-color);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  transform: translateZ(0);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.worldview-content:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
}

/* 极致内容排版 */
.worldview-body {
  font-size: 1rem;
  font-variation-settings: 'wght' 450;
}

.worldview-body > * + * {
  margin-top: 1.25rem;
}

.worldview-body h1,
.worldview-body h2,
.worldview-body h3 {
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.worldview-body h1 {
  font-size: 1.6rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.worldview-body h2 {
  font-size: 1.4rem;
}

.worldview-body h3 {
  font-size: 1.2rem;
}

.worldview-body p {
  margin: 0;
  line-height: 1.7;
}

.worldview-body a {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid transparent;
}

.worldview-body a:hover {
  color: var(--primary-hover-color);
  border-bottom-color: currentColor;
}

/* 极简列表 */
.worldview-body ul,
.worldview-body ol {
  padding-left: 1.5rem;
  margin: 0;
}

.worldview-body li {
  margin: 0.25rem 0;
  position: relative;
}

.worldview-body ul li::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 50%;
  margin-right: 0.75rem;
  position: relative;
  top: -0.15em;
}

/* 代码块优化 */
.worldview-body pre {
  background: var(--form-bg-color);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 1.25rem 0;
  border: 1px solid var(--border-color);
}

.worldview-body code {
  font-family: 'Consolas', monospace;
  background: var(--form-bg-color);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

/* 极简作者卡片 */
.author-bio {
  background: var(--card-bg-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  transform: translateZ(0);
}

.author-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.author-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
}

.author-details .author-name {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.author-details p {
  font-size: 0.9rem;
  color: var(--text-secondary-color);
  margin: 0;
  line-height: 1.5;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .worldview-detail {
    padding: 1rem;
  }
  
  .worldview-title {
    font-size: 1.8rem;
  }
  
  .worldview-content {
    padding: 1.5rem;
  }
  
  .author-bio {
    padding: 1.25rem;
  }
  
  .author-card {
    flex-direction: column;
    text-align: center;
  }
  
  .author-avatar-large {
    width: 48px;
    height: 48px;
  }
  
  .worldview-body h1 {
    font-size: 1.5rem;
  }
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 防闪烁保险 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
      description: '微软WinUI3设计风格，极致简洁的深色主题'
    },
    {
      name: '深色科技感',
      value: `/* 深色科技感主题 - 优化版 */
.worldview-detail {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #e0f7fa;
  border: 2px solid #00bcd4;
  box-shadow: 0 8px 32px rgba(0, 188, 212, 0.15);
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
}

.worldview-header {
  background: linear-gradient(90deg, rgba(0, 188, 212, 0.1) 0%, rgba(100, 255, 218, 0.05) 100%);
  border-bottom: 3px solid #00bcd4;
  padding: 2.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.worldview-title {
  color: #64ffda;
  font-size: 3rem;
  text-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
}

.worldview-content {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  backdrop-filter: blur(5px);
}

.worldview-body {
  line-height: 1.8;
  font-size: 1.15rem;
  color: #b3e5fc;
}

.worldview-body p {
  margin-bottom: 1.5rem;
}

.worldview-body h1 {
  color: #4fc3f7;
  border-bottom: 2px solid rgba(79, 195, 247, 0.3);
  padding-bottom: 0.8rem;
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
  font-weight: 600;
}

.worldview-body h2 {
  color: #29b6f6;
  border-left: 4px solid #29b6f6;
  padding-left: 1rem;
  margin: 2rem 0 1rem 0;
  font-size: 1.8rem;
}

.worldview-body h3 {
  color: #81d4fa;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
}

.worldview-body strong {
  color: #64ffda;
  font-weight: 600;
}

.worldview-body em {
  color: #b3e5fc;
  font-style: italic;
}

.worldview-body code {
  background: rgba(0, 188, 212, 0.1);
  color: #64ffda;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}`,
      description: '深色背景搭配霓虹蓝绿，现代科技风格'
    },
    {
      name: '奇幻魔法风',
      value: `/* 奇幻魔法风格 - 优化版 */
.worldview-detail {
  background: linear-gradient(135deg, #1a0638 0%, #4a1c6b 50%, #6a0dad 100%);
  color: #f3e5f5;
  font-family: 'Georgia', 'Times New Roman', serif;
  border: 2px solid #8a2be2;
  box-shadow: 0 8px 32px rgba(138, 43, 226, 0.25);
  border-radius: 16px;
  overflow: hidden;
}

.worldview-header {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(138, 43, 226, 0.1) 100%);
  border-bottom: 3px solid #ffd700;
  padding: 2.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(8px);
  text-align: center;
}

.worldview-title {
  color: #ffd700;
  font-size: 3rem;
  text-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
}

.worldview-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  backdrop-filter: blur(5px);
}

.worldview-body {
  line-height: 1.8;
  font-size: 1.15rem;
  color: #e1bee7;
}

.worldview-body p {
  margin-bottom: 1.5rem;
  text-indent: 2em;
}

.worldview-body h1 {
  color: #ff6b6b;
  border-left: 5px solid #ff6b6b;
  padding-left: 1rem;
  margin: 2rem 0 1rem 0;
  font-size: 2.2rem;
  font-weight: bold;
}

.worldview-body h2 {
  color: #ba68c8;
  border-bottom: 2px solid rgba(186, 104, 200, 0.3);
  padding-bottom: 0.5rem;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.8rem;
}

.worldview-body h3 {
  color: #ce93d8;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
}

.worldview-body strong {
  color: #ffd700;
  font-weight: bold;
}

.worldview-body em {
  color: #e1bee7;
  font-style: italic;
  text-shadow: 0 0 5px rgba(225, 190, 231, 0.3);
}`,
      description: '紫金配色搭配发光效果，神秘魔法风格'
    },
    {
      name: '自定义样式',
      value: `/* 赛博朋克风格 - 新增 */
.worldview-detail {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #2d0a4a 100%);
  color: #ff00ff;
  border: 2px solid #ff00ff;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.4);
  border-radius: 0;
  overflow: hidden;
  font-family: 'Courier New', monospace;
}

.worldview-header {
  background: linear-gradient(90deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 255, 255, 0.1) 100%);
  border-bottom: 4px solid #00ffff;
  padding: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  backdrop-filter: blur(5px);
}

.worldview-title {
  color: #00ffff;
  font-size: 3.2rem;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
  font-weight: 900;
  margin: 0;
  letter-spacing: 2px;
}

.worldview-content {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #ff00ff;
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 0;
  box-shadow: inset 0 0 20px rgba(255, 0, 255, 0.3);
}

.worldview-body {
  line-height: 1.6;
  font-size: 1.1rem;
  color: #00ff00;
}

.worldview-body p {
  margin-bottom: 1.5rem;
  border-left: 3px solid #ff00ff;
  padding-left: 1rem;
}

.worldview-body h1 {
  color: #ffff00;
  border-bottom: 2px solid rgba(255, 255, 0, 0.3);
  padding-bottom: 0.8rem;
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
}

.worldview-body h2 {
  color: #ff00ff;
  margin: 2rem 0 1rem 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.worldview-body h3 {
  color: #00ffff;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
}

.worldview-body strong {
  color: #ffff00;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 255, 0, 0.5);
}

.worldview-body em {
  color: #00ffff;
  font-style: italic;
}

.worldview-body code {
  background: rgba(255, 0, 255, 0.1);
  color: #ffff00;
  padding: 0.2rem 0.4rem;
  border: 1px solid #ff00ff;
  font-family: 'Courier New', monospace;
}`,
      description: '完全自定义您的CSS样式，输入框将显示当前使用的CSS代码'
    }
  ];

  const validateCSS = (css) => {
    try {
      // 简单的CSS验证 - 检查基本的语法错误
      if (css.trim() === '') {
        setIsValidCSS(true);
        setCSSError('');
        return true;
      }

      // 检查是否有未闭合的注释
      const commentStack = [];
      const lines = css.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const commentStart = line.indexOf('/*');
        const commentEnd = line.indexOf('*/');
        
        if (commentStart !== -1 && commentEnd === -1) {
          commentStack.push(i);
        } else if (commentEnd !== -1 && commentStart === -1) {
          if (commentStack.length === 0) {
            setCSSError(`第${i + 1}行：未匹配的注释结束符 */`);
            return false;
          }
          commentStack.pop();
        }
      }

      if (commentStack.length > 0) {
        setCSSError(`第${commentStack[0] + 1}行：未闭合的注释 /*`);
        return false;
      }

      // 检查大括号匹配
      let braceCount = 0;
      for (let i = 0; i < css.length; i++) {
        if (css[i] === '{') braceCount++;
        if (css[i] === '}') braceCount--;
        if (braceCount < 0) {
          setCSSError(`位置${i}：未匹配的闭合大括号 }`);
          return false;
        }
      }

      if (braceCount > 0) {
        setCSSError('未闭合的大括号 {');
        return false;
      }

      setIsValidCSS(true);
      setCSSError('');
      return true;
    } catch (error) {
      setCSSError('CSS语法验证失败');
      return false;
    }
  };

  const handleCSSChange = (newCSS) => {
    if (validateCSS(newCSS)) {
      onCSSChange(newCSS);
    }
  };

  // 自动调整文本区域高度
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      // 重置高度以获取正确的scrollHeight
      textareaRef.current.style.height = 'auto';
      // 设置最小高度
      const minHeight = 200;
      // 计算新高度，但不小于最小高度
      const newHeight = Math.max(textareaRef.current.scrollHeight, minHeight);
      textareaRef.current.style.height = newHeight + 'px';
    }
  };

  // 处理文本区域输入
  const handleTextareaChange = (e) => {
    const newCSS = e.target.value;
    handleCSSChange(newCSS);
    autoResizeTextarea();
  };

  // 初始化时调整高度
  useEffect(() => {
    // 使用setTimeout确保DOM已更新
    const timer = setTimeout(() => {
      autoResizeTextarea();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [customCSS, isExpanded, showCustomEditor]);

  const handlePresetSelect = (presetValue, presetName) => {
    setSelectedPreset(presetName); // 更新选中的预设样式
    
    // 只有"自定义样式"会显示自定义CSS编辑器
    if (presetName === '自定义样式') {
      setShowCustomEditor(true);
      // 不修改CSS，保持当前使用的CSS代码
      // 如果当前没有CSS代码，则使用默认样式
      if (!customCSS || customCSS.trim() === '') {
        // 获取默认样式
        const defaultPreset = presetStyles.find(p => p.name === '默认样式');
        if (defaultPreset) {
          onCSSChange(defaultPreset.value);
          // 使用setTimeout确保在DOM更新后调整高度
          setTimeout(() => {
            autoResizeTextarea();
          }, 0);
        }
      } else {
        // 如果已有CSS内容，也需要调整高度
        setTimeout(() => {
          autoResizeTextarea();
        }, 0);
      }
    } else {
      // 其他样式隐藏自定义CSS编辑器，清空输入框并直接应用
      setShowCustomEditor(false);
      handleCSSChange('');
      onCSSChange(presetValue);
    }
  };

  // 复制当前CSS样式到剪贴板
  const copyCurrentStyle = async () => {
    try {
      await navigator.clipboard.writeText(customCSS);
      setCopyType('current');
      setCopyStatus('已复制当前CSS样式！');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('复制失败，请手动复制');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  // 复制默认样式到剪贴板
  const copyDefaultStyle = async () => {
    const defaultStyle = `.worldview-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.worldview-header {
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.worldview-number {
  font-size: 1.2rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.worldview-title {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.worldview-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.author-name {
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.author-name:hover {
  color: var(--primary-color);
}

.publish-date {
  font-size: 0.9rem;
  color: var(--text-secondary-color);
}

.worldview-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.worldview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
}

.category-tag {
  background-color: var(--primary-color);
  color: white;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tag {
  background-color: var(--tag-bg-color);
  color: var(--primary-color);
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.worldview-content {
  background-color: var(--card-bg-color);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 3rem;
  margin-bottom: 3rem;
}

.worldview-description {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.worldview-description h3 {
  margin-bottom: 1.5rem;
  color: #ffffff !important;
  font-size: 1.5rem;
}

.worldview-description p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #ffffff !important;
}

.worldview-body {
  line-height: 1.8;
  font-size: 1.05rem;
}

.worldview-body h1, 
.worldview-body h2, 
.worldview-body h3 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.worldview-body h1 {
  font-size: 2rem;
}

.worldview-body h2 {
  font-size: 1.7rem;
}

.worldview-body h3 {
  font-size: 1.4rem;
}

.worldview-body p {
  margin-bottom: 1.5rem;
  color: #ffffff !important;
}

.worldview-body ul, 
.worldview-body ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.worldview-body li {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

/* 确保ReactMarkdown渲染的所有文本元素都使用正确的颜色 */
.worldview-body h1, 
.worldview-body h2, 
.worldview-body h3,
.worldview-body h4,
.worldview-body h5,
.worldview-body h6 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff !important;
}

.worldview-body p,
.worldview-body ul,
.worldview-body ol,
.worldview-body li,
.worldview-body blockquote,
.worldview-body table,
.worldview-body tr,
.worldview-body td,
.worldview-body th {
  color: #ffffff !important;
}

.worldview-body a {
  color: var(--primary-color);
}

.worldview-body a:hover {
  color: var(--primary-hover-color);
}

.worldview-body blockquote {
  border-left: 4px solid var(--primary-color);
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
}

.worldview-body code {
  background-color: var(--form-bg-color);
  color: #ffffff;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
}

.worldview-body pre {
  background-color: var(--form-bg-color);
  color: #ffffff;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.worldview-body pre code {
  background-color: transparent;
  padding: 0;
}

.worldview-footer {
  margin-top: 3rem;
}

.author-bio {
  background-color: var(--card-bg-color);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 2.5rem;
  margin-bottom: 3rem;
}

.author-bio h3 {
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-size: 1.5rem;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.author-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--primary-color);
}

.author-details .author-name {
  display: block;
  margin-bottom: 0.75rem;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.author-details .author-name:hover {
  color: var(--primary-color);
}

.author-details p {
  margin-bottom: 1.2rem;
  color: #ffffff;
  line-height: 1.6;
}

.author-id {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 600;
  background-color: var(--card-bg-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
}

@media (max-width: 768px) {
  .worldview-detail {
    padding: 1.5rem 1rem;
  }
  
  .worldview-title {
    font-size: 2.2rem;
  }
  
  .worldview-content {
    padding: 2rem;
  }
  
  .author-bio {
    padding: 2rem;
  }
  
  .worldview-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .author-card {
    flex-direction: column;
    text-align: center;
  }
  
  .author-avatar-large {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .worldview-detail {
    padding: 1rem 0.75rem;
  }
  
  .worldview-title {
    font-size: 2rem;
  }
  
  .worldview-content {
    padding: 1.5rem;
  }
  
  .author-bio {
    padding: 1.5rem;
  }
  
  .worldview-body {
    font-size: 1rem;
  }
  
  .worldview-body h1 {
    font-size: 1.8rem;
  }
  
  .worldview-body h2 {
    font-size: 1.5rem;
  }
  
  .worldview-body h3 {
    font-size: 1.3rem;
  }
}`;

    try {
      await navigator.clipboard.writeText(defaultStyle);
      setCopyType('default');
      setCopyStatus('已复制默认CSS样式！');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('复制失败，请手动复制');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  // 恢复默认样式
  const resetToDefault = () => {
    handleCSSChange('');
    setCopyStatus('已恢复默认样式！');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <div className="custom-css-injector">
      <div className="css-toggle-header">
        <button
          type="button"
          className={`css-toggle-btn ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>自定义CSS样式</span>
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
        </button>
        <span className="css-hint">（可选）为世界观页面添加自定义样式</span>
      </div>

      {isExpanded && (
        <div className="css-content">
          {showPresets && (
            <div className="preset-styles">
              <h4>预设样式</h4>
              <div className="preset-grid">
                {presetStyles.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`preset-btn ${selectedPreset === preset.name ? 'active' : ''}`}
                    onClick={() => handlePresetSelect(preset.value, preset.name)}
                  >
                    <div className="preset-name">{preset.name}</div>
                    <div className="preset-desc">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showCustomEditor && selectedPreset === '自定义样式' && (
            <div className="custom-css-editor">
              <div className="editor-header">
                <div className="editor-title-section">
                  <h4>自定义CSS代码</h4>
                  <div className="button-group">
                    <button 
                      type="button" 
                      className="copy-btn"
                      onClick={copyCurrentStyle}
                      title="复制当前CSS样式"
                    >
                      {copyType === 'current' && copyStatus.includes('已复制') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="8" y="8" width="12" height="12" rx="2" />
                          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                        </svg>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="copy-btn"
                      onClick={copyDefaultStyle}
                      title="复制默认CSS样式"
                    >
                      {copyType === 'default' && copyStatus.includes('已复制') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="8" y="8" width="12" height="12" rx="2" />
                          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                        </svg>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="reset-btn"
                      onClick={resetToDefault}
                      title="恢复默认样式"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {!isValidCSS && (
                  <span className="css-error">CSS语法错误</span>
                )}
              </div>
              
              <div className="status-message">
                {copyStatus && (
                  <span className={`copy-status ${copyStatus.includes('失败') ? 'error' : 'success'}`}>
                    {copyStatus}
                  </span>
                )}
              </div>
              
              <textarea
                  ref={textareaRef}
                  value={customCSS}
                  onChange={handleTextareaChange}
                  className={`css-textarea ${!isValidCSS ? 'error' : ''}`}
                  placeholder="在此输入您的自定义CSS代码..."
                  rows={8}
                />
              
              {cssError && (
                <div className="error-message">
                  {cssError}
                </div>
              )}
              
              <div className="css-help">
                <strong>提示：</strong>输入框显示当前CSS样式代码，使用上方按钮进行复制或恢复操作
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCSSInjector;