import React from 'react';
import './TechDocs.css';

const TechDocs = () => {
  return (
    <div className="tech-docs">
      <div className="container">
        <div className="docs-header">
          <h1>技术文档</h1>
          <p>世界观自定义CSS样式完整指南</p>
        </div>

        <div className="docs-content">
          <section className="docs-section">
            <h2>📋 概述</h2>
            <p>
              世界观平台支持完全自定义CSS样式，创作者可以为自己的世界观页面添加独特的视觉效果。
              支持所有CSS选择器，包括类选择器、ID选择器、元素选择器、伪类等。
            </p>
          </section>

          <section className="docs-section">
            <h2>🎨 预设样式</h2>
            <p>系统提供4种预设样式，可快速应用到世界观页面：</p>
            
            <div className="preset-list">
              <div className="preset-item">
                <h3>默认样式</h3>
                <p>使用系统默认的深色主题样式</p>
              </div>
              
              <div className="preset-item">
                <h3>深色科技感</h3>
                <p>深色背景搭配科技蓝，适合科幻主题</p>
                <code>background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);</code>
              </div>
              
              <div className="preset-item">
                <h3>奇幻魔法风</h3>
                <p>紫色背景搭配金色标题，适合奇幻主题</p>
                <code>background: linear-gradient(135deg, #2c003e 0%, #4a0072 100%);</code>
              </div>
              
              <div className="preset-item">
                <h3>简约现代</h3>
                <p>简约的深色设计，适合现代主题</p>
                <code>background: #1e1e1e; color: #ffffff;</code>
              </div>
              
              <div className="preset-item">
                <h3>复古羊皮纸</h3>
                <p>仿古羊皮纸效果，适合历史或复古主题</p>
                <code>background: #f5e8c8; color: #5d4037;</code>
              </div>
            </div>
          </section>

          <section className="docs-section">
            <h2>🔧 可用CSS选择器</h2>
            <p>以下是世界观详情页面的主要CSS类名和对应的HTML结构：</p>
            
            <div className="selectors-grid">
              <div className="selector-item">
                <h3><code>.worldview-detail</code></h3>
                <p><strong>世界观详情容器</strong></p>
                <p>整个世界观页面的最外层容器，包含所有内容</p>
                <pre>{`<div class="worldview-detail">
  <!-- 世界观内容 -->
</div>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.worldview-header</code></h3>
                <p><strong>头部区域</strong></p>
                <p>包含世界观标题、作者信息、发布时间等</p>
                <pre>{`<div class="worldview-header">
  <div class="worldview-number">编号: #123</div>
  <h1 class="worldview-title">世界观标题</h1>
  <div class="worldview-meta">
    <!-- 作者信息 -->
  </div>
</div>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.worldview-title</code></h3>
                <p><strong>世界观标题</strong></p>
                <p>世界观的标题文本，通常使用h1标签</p>
                <pre>{`<h1 class="worldview-title">世界观标题</h1>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.worldview-content</code></h3>
                <p><strong>内容区域</strong></p>
                <p>包含世界观简介和正文内容</p>
                <pre>{`<div class="worldview-content">
  <div class="worldview-description">
    <h3>简介</h3>
    <p>世界观简介内容</p>
  </div>
  <div class="worldview-body">
    <!-- Markdown渲染内容 -->
  </div>
</div>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.worldview-body</code></h3>
                <p><strong>正文内容</strong></p>
                <p>世界观的主要文本内容，由Markdown渲染生成</p>
                <pre>{`<div class="worldview-body">
  <p>正文段落</p>
  <h2>二级标题</h2>
  <ul>
    <li>列表项</li>
  </ul>
</div>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.worldview-description</code></h3>
                <p><strong>简介区域</strong></p>
                <p>世界观的简短描述和介绍</p>
                <pre>{`<div class="worldview-description">
  <h3>简介</h3>
  <p>世界观简介内容</p>
</div>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.author-info</code></h3>
                <p><strong>作者信息容器</strong></p>
                <p>包含作者头像、用户名等信息的容器</p>
                <pre>{`<div class="author-info">
  <img class="author-avatar" src="avatar.jpg" />
  <div>
    <a class="author-name">用户名</a>
    <div class="publish-date">发布时间</div>
  </div>
</div>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.author-avatar</code></h3>
                <p><strong>作者头像</strong></p>
                <p>作者的头像图片</p>
                <pre>{`<img class="author-avatar" src="avatar.jpg" />`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.author-name</code></h3>
                <p><strong>作者名称</strong></p>
                <p>作者的用户名链接</p>
                <pre>{`<a class="author-name">用户名</a>`}</pre>
              </div>
              
              <div className="selector-item">
                <h3><code>.worldview-number</code></h3>
                <p><strong>世界观编号</strong></p>
                <p>显示世界观的唯一编号</p>
                <pre>{`<div class="worldview-number">编号: #123</div>`}</pre>
              </div>
            </div>
          </section>

          <section className="docs-section">
            <h2>🎯 高级选择器支持</h2>
            <p>除了基本的类选择器，还支持所有CSS选择器类型：</p>
            
            <div className="advanced-selectors">
              <div className="selector-type">
                <h3>元素选择器</h3>
                <pre>{`h1, h2, h3 {
  color: #64ffda;
}

p {
  line-height: 1.6;
}`}</pre>
              </div>
              
              <div className="selector-type">
                <h3>ID选择器</h3>
                <pre>{`#specific-element {
  background: #ff6b6b;
}`}</pre>
              </div>
              
              <div className="selector-type">
                <h3>属性选择器</h3>
                <pre>{`[data-theme="dark"] {
  background: #1a1a1a;
}

input[type="text"] {
  border: 1px solid #333;
}`}</pre>
              </div>
              
              <div className="selector-type">
                <h3>伪类选择器</h3>
                <pre>{`.author-name:hover {
  color: #64ffda;
}

.worldview-body p:first-child {
  font-size: 1.2em;
}`}</pre>
              </div>
              
              <div className="selector-type">
                <h3>组合选择器</h3>
                <pre>{`/* 后代选择器 */
.worldview-content h2 {
  border-bottom: 2px solid #64ffda;
}

/* 子选择器 */
.worldview-header > .worldview-title {
  margin-bottom: 1rem;
}

/* 相邻兄弟选择器 */
.worldview-description + .worldview-body {
  margin-top: 2rem;
}`}</pre>
              </div>
            </div>
          </section>

          <section className="docs-section">
            <h2>💡 使用示例</h2>
            
            <div className="examples">
              <div className="example">
                <h3>示例1：科技感主题</h3>
                <pre>{`.worldview-detail {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  color: #e0e0e0;
  border: 1px solid #64ffda;
}

.worldview-title {
  color: #64ffda;
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
}

.worldview-body h1, .worldview-body h2 {
  color: #4fc3f7;
  border-left: 4px solid #4fc3f7;
  padding-left: 1rem;
}`}</pre>
              </div>
              
              <div className="example">
                <h3>示例2：魔法主题</h3>
                <pre>{`.worldview-detail {
  background: #2c003e;
  color: #f0e6ff;
  font-family: 'Georgia', serif;
}

.worldview-header {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #ff6b6b;
  border-radius: 15px;
}

.worldview-title {
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}`}</pre>
              </div>
              
              <div className="example">
                <h3>示例3：自定义动画</h3>
                <pre>{`@keyframes glow {
  0% { box-shadow: 0 0 5px #64ffda; }
  50% { box-shadow: 0 0 20px #64ffda; }
  100% { box-shadow: 0 0 5px #64ffda; }
}

.worldview-header {
  animation: glow 2s infinite;
}

.author-avatar {
  transition: transform 0.3s ease;
}

.author-avatar:hover {
  transform: scale(1.1);
}`}</pre>
              </div>
            </div>
          </section>

          <section className="docs-section">
            <h2>🤖 AI写样式提示词指南</h2>
            <p>如果您使用AI助手来编写CSS样式，可以使用以下提示词模板：</p>
            
            <div className="ai-prompts">
              <div className="prompt-category">
                <h3>基础提示词模板</h3>
                <div className="prompt-example">
                  <p><strong>通用模板：</strong></p>
                  <pre>{`请为世界观页面编写CSS样式，要求：
- 主题风格：[科技感/奇幻/简约/复古]
- 主色调：[颜色代码或描述]
- 特殊效果：[动画/渐变/阴影等]
- 目标：创建[氛围描述]的视觉效果`}</pre>
                </div>
                
                <div className="prompt-example">
                  <p><strong>具体示例：</strong></p>
                  <pre>{`请为科幻世界观编写CSS样式：
- 主题：深色科技感
- 主色调：科技蓝 (#64ffda) 和深空黑 (#0f0f23)
- 效果：发光边框、渐变背景、代码字体
- 目标：创造未来科技实验室的氛围`}</pre>
                </div>
              </div>
              
              <div className="prompt-category">
                <h3>高级提示词技巧</h3>
                <div className="tips-grid">
                  <div className="tip-item">
                    <h4>🎯 明确选择器</h4>
                    <p>指定要修改的具体元素：</p>
                    <code>"修改.worldview-title的字体和颜色"</code>
                  </div>
                  
                  <div className="tip-item">
                    <h4>🌈 颜色规范</h4>
                    <p>提供具体的颜色要求：</p>
                    <code>"使用深色主题，背景色为#1a1a1a，文字色为#e0e0e0"</code>
                  </div>
                  
                  <div className="tip-item">
                    <h4>⚡ 动画效果</h4>
                    <p>描述想要的动态效果：</p>
                    <code>"为标题添加缓慢的呼吸发光效果"</code>
                  </div>
                  
                  <div className="tip-item">
                    <h4>📱 响应式</h4>
                    <p>考虑不同设备：</p>
                    <code>"确保在移动设备上也能正常显示"</code>
                  </div>
                </div>
              </div>
              
              <div className="prompt-category">
                <h3>最佳实践提示词</h3>
                <pre>{`请编写符合以下要求的CSS：
1. 深色主题，背景色不超过#333333
2. 良好的可读性，文字对比度足够
3. 适当的动画效果，不超过2秒
4. 支持响应式设计
5. 使用现代CSS特性（如CSS变量、Grid布局等）
6. 代码注释清晰，便于后续修改`}</pre>
              </div>
            </div>
          </section>

          <section className="docs-section">
            <h2>⚠️ 注意事项</h2>
            <div className="notes-grid">
              <div className="note-category">
                <h3>✅ 支持的功能</h3>
                <ul>
                  <li><strong>所有CSS选择器</strong> - 类、ID、元素、伪类等</li>
                  <li><strong>实时语法验证</strong> - 基础语法检查</li>
                  <li><strong>预设样式快速应用</strong> - 4种主题模板</li>
                  <li><strong>CSS3特性</strong> - 渐变、动画、变换等</li>
                </ul>
              </div>
              
              <div className="note-category">
                <h3>⚠️ 设计建议</h3>
                <ul>
                  <li><strong>遵循深色主题</strong> - 背景色建议使用深色</li>
                  <li><strong>保持可读性</strong> - 文字对比度要足够</li>
                  <li><strong>适度使用动画</strong> - 避免过度干扰</li>
                  <li><strong>响应式设计</strong> - 考虑移动端体验</li>
                </ul>
              </div>
              
              <div className="note-category">
                <h3>❌ 禁止内容</h3>
                <ul>
                  <li><strong>JavaScript代码</strong> - 不支持脚本注入</li>
                  <li><strong>外部资源</strong> - 不支持加载外部字体或图片</li>
                  <li><strong>恶意代码</strong> - 禁止任何有害代码</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TechDocs;