import React, { useState } from 'react';
import './CustomCSSInjector.css';

const CustomCSSInjector = ({ 
  customCSS = '', 
  onCSSChange = () => {},
  showPresets = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isValidCSS, setIsValidCSS] = useState(true);
  const [cssError, setCSSError] = useState('');

  // 预设样式选项
  const presetStyles = [
    {
      name: '默认样式',
      value: '',
      description: '使用系统默认样式'
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
      name: '复古羊皮纸',
      value: `/* 复古羊皮纸风格 - 优化版 */
.worldview-detail {
  background: linear-gradient(135deg, #f5e8c8 0%, #e6d2b5 50%, #d4b896 100%);
  color: #5d4037;
  font-family: 'Times New Roman', 'Georgia', serif;
  border: 3px double #8d6e63;
  box-shadow: 0 8px 25px rgba(141, 110, 99, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.worldview-header {
  background: rgba(141, 110, 99, 0.15);
  border-bottom: 4px double #8d6e63;
  padding: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.worldview-title {
  color: #5d4037;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(93, 64, 55, 0.2);
  margin: 0;
  letter-spacing: 1px;
}

.worldview-content {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid #bcaaa4;
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 2px;
  box-shadow: inset 0 0 20px rgba(188, 170, 164, 0.2);
}

.worldview-body {
  line-height: 1.8;
  font-size: 1.15rem;
  color: #4e342e;
}

.worldview-body p {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.worldview-body h1 {
  color: #795548;
  border-bottom: 3px double #a1887f;
  padding-bottom: 0.8rem;
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
  font-weight: bold;
}

.worldview-body h2 {
  color: #6d4c41;
  border-left: 4px solid #8d6e63;
  padding-left: 1rem;
  margin: 2rem 0 1rem 0;
  font-size: 1.8rem;
}

.worldview-body h3 {
  color: #5d4037;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
  font-style: italic;
}

.worldview-body strong {
  color: #5d4037;
  font-weight: bold;
}

.worldview-body em {
  font-style: italic;
  color: #6d4c41;
  text-decoration: underline;
}`,
      description: '古典羊皮纸风格，温暖怀旧的色调'
    },
    {
      name: '赛博朋克',
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
      description: '未来科技风格，霓虹粉紫配色，赛博朋克主题'
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

  const handlePresetSelect = (presetValue) => {
    handleCSSChange(presetValue);
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
                    className={`preset-btn ${customCSS === preset.value ? 'active' : ''}`}
                    onClick={() => handlePresetSelect(preset.value)}
                  >
                    <div className="preset-name">{preset.name}</div>
                    <div className="preset-desc">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="custom-css-editor">
            <div className="editor-header">
              <h4>自定义CSS代码</h4>
              {!isValidCSS && (
                <span className="css-error">CSS语法错误</span>
              )}
            </div>
            
            <textarea
              value={customCSS}
              onChange={(e) => handleCSSChange(e.target.value)}
              className={`css-textarea ${!isValidCSS ? 'error' : ''}`}
              placeholder="在此处输入自定义CSS代码...
例如：
.worldview-detail {
  background: #1a1a1a;
  color: #ffffff;
}"
              rows={12}
            />
            
            {cssError && (
              <div className="error-message">
                {cssError}
              </div>
            )}
            
            <div className="css-help">
              <strong>提示：</strong>支持所有CSS选择器，可以自由编写任何CSS代码
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCSSInjector;