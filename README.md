# World Platform - 世界观发布平台

> **注意：本项目完全由AI（人工智能）编写，包括前端、后端代码以及文档。**

一个完整的世界观发布平台，包含用户系统和内容管理功能。

## 功能特性

- 🔐 完整的用户注册/登录系统
- 🌍 世界观创建、编辑和发布
- 🔍 世界观浏览和搜索
- 👤 用户个人中心
- 💬 评论和互动功能
- 📱 响应式设计
- 🖼️ 头像上传功能
- 🎨 自定义CSS样式（预设+手动编写）


## 技术栈

### 后端
- Node.js + Express
- PostgreSQL + Sequelize
- JWT 身份验证
- bcrypt 密码加密
- Multer 文件上传

### Web前端
- React
- React Router
- Axios
- 现代化 UI 设计



## 快速开始

1. 安装依赖
```bash
npm run install-all
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置数据库连接等信息
```

3. 启动开发服务器
```bash
npm run dev
```

## 项目结构

```
world/
├── server/          # 后端代码
│   ├── routes/      # API路由
│   ├── models/      # 数据模型
│   ├── middleware/  # 中间件
│   ├── config/      # 配置文件
│   ├── DatabaseManager/ # 数据库管理
│   └── uploads/     # 文件上传目录
├── client/          # Web前端代码
│   ├── src/         # 源代码
│   │   ├── components/ # React组件
│   │   ├── pages/      # 页面组件
│   │   ├── context/    # 上下文
│   │   ├── services/   # 服务层
│   │   ├── styles/     # 样式文件
│   │   └── utils/      # 工具函数
│   ├── public/      # 静态资源
│   └── build/       # 构建输出
├── test.js/         # 测试脚本目录
└── README.md        # 项目文档
```

## 环境变量

- `DB_HOST` - 数据库主机
- `DB_NAME` - 数据库名称
- `DB_USER` - 数据库用户
- `DB_PASSWORD` - 数据库密码
- `JWT_SECRET` - JWT 密钥
- `PORT` - 服务器端口（默认：5000）

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取当前用户

### 用户
- `GET /api/users/profile` - 获取用户资料
- `PUT /api/users/profile` - 更新用户资料
- `POST /api/users/avatar` - 上传用户头像
- `PUT /api/users/password` - 修改密码

### 世界观
- `GET /api/worldviews` - 获取世界观列表
- `GET /api/worldviews/:id` - 获取单个世界观
- `POST /api/worldviews` - 发布世界观
- `PUT /api/worldviews/:id` - 更新世界观
- `DELETE /api/worldviews/:id` - 删除世界观

### 评论
- `GET /api/comments/:worldviewId` - 获取世界观评论
- `POST /api/comments` - 添加评论
- `PUT /api/comments/:id` - 更新评论
- `DELETE /api/comments/:id` - 删除评论




## 头像上传功能

### 功能说明
用户可以在个人资料页面上传自定义头像，系统会自动处理图片上传、保存和显示。

### 使用方法
1. 登录账户
2. 访问个人资料页面 (/profile)
3. 在"编辑资料"标签页中，找到头像部分
4. 点击头像区域或上传按钮选择图片文件
5. 确认上传后，头像会自动更新

### 技术实现
- 前端：React组件`AvatarUpload`处理图片预览和上传
- 后端：Express路由`/api/users/avatar`处理文件上传
- 存储：使用multer中间件，文件保存在`uploads/avatars`目录
- 限制：仅支持图片文件，最大文件大小5MB



## 项目更新记录


### 2025-10-19 - 自定义CSS样式功能
**修改内容：**
- **前端组件**：
  - 创建`CustomCSSInjector`组件，支持自定义CSS样式
  - 提供4种预设样式：深色科技感、奇幻魔法风、简约现代、复古羊皮纸
  - 支持手动编写自定义CSS代码，实时语法验证
  - 折叠式设计，默认收起，保持界面简洁

- **后端支持**：
  - 世界观模型添加`customCSS`字段，存储自定义样式
  - 世界观路由支持创建和更新时处理自定义CSS
  - 世界观详情页面自动注入自定义CSS样式

- **功能特性**：
  - 创作者可自定义世界观页面样式
  - 预设样式快速应用，适合不同主题
  - 实时CSS语法验证，防止错误代码
  - 世界观详情页面动态应用自定义样式

- **测试脚本**：
  - 创建`test.js/README.md`测试说明文档
  - 包含功能概述、测试要点和使用说明

### 2025-10-19 - 删除世界观测试脚本
**修改内容：**
- **测试脚本功能**：
  - 创建`test.js/删除世界观测试.md`测试脚本
  - 支持单个世界观删除和批量删除功能
  - 提供删除确认机制，防止误操作
  - 支持浏览所有公开世界观和用户自己的世界观
  - 包含完整的错误处理和用户交互界面

- **脚本特性**：
  - 交互式命令行界面，易于使用
  - 支持按编号或ID删除世界观
  - 批量删除支持选择多个或删除所有
  - 显示详细的删除操作日志
  - 需要用户登录认证，确保安全性

### 2025-10-19 - 评论系统多层嵌套回复功能
**修改内容：**
- **后端优化**：
  - 重构评论查询逻辑，支持无限层级嵌套回复
  - 使用递归函数获取评论及其所有子评论
  - 优化API性能，减少数据库查询次数

- **前端实现**：
  - 创建递归评论组件，支持多层嵌套渲染
  - 实现回复表单定位功能，点击回复按钮后表单出现在对应评论下方
  - 添加折叠/展开回复功能，提升用户体验
  - 设置最大嵌套层级为5层，超过时显示友好提示

- **样式优化**：
  - 统一多层嵌套的灰色边框样式
  - 为回复表单添加专门的CSS样式
  - 优化响应式设计，确保移动端体验良好

- **功能特性**：
  - 支持无限层级嵌套对话
  - 回复表单智能定位，避免顶部表单占用空间
  - 折叠功能减少页面冗长

### 2025-01-19 - 技术文档页面边栏和下拉菜单功能
**修改内容：**
- **边栏导航功能**：
  - 添加左侧文档边栏，包含所有章节导航
  - 实现点击导航自动滚动到对应章节
  - 滚动时自动更新活跃章节高亮
  - 显示阅读进度条，实时计算阅读百分比

- **下拉菜单功能**：
  - 在边栏底部添加"更多选项"下拉菜单
  - 提供打印文档、返回顶部、跳转到底部等快捷功能
  - 包含分享链接和导出PDF选项（预留功能）
  - 使用WinUI3风格设计，支持展开/收起动画

- **移动端适配**：
  - 响应式设计，移动端自动隐藏边栏
  - 添加移动端边栏切换按钮
  - 添加遮罩层，点击可关闭边栏
  - 优化小屏幕下的交互体验

- **样式设计**：
  - 边栏采用深色半透明背景（rgba(26, 26, 46, 0.95)）
  - 使用#64ffda作为强调色，符合项目主题
  - 添加平滑过渡动画和悬停效果
  - 导航项目使用图标和文字组合

- **技术实现**：
  - 使用React状态管理边栏开关、活跃章节、下拉菜单状态
  - 实现滚动监听，自动更新活跃章节和阅读进度
  - 添加平滑滚动效果，提升用户体验
  - 创建完整的测试脚本验证功能

- **文件变更**：
  - 更新`client/src/pages/TechDocs.js`，添加边栏组件和状态管理
  - 扩展`client/src/pages/TechDocs.css`，添加边栏和下拉菜单样式
  - 创建`test.js/test-techdocs-sidebar.js`测试脚本
  - 更新测试文档，添加边栏功能测试项目

### 2025-10-20 - 技术文档页面侧边栏和样式优化
**修改内容：**
- **侧边栏优化**：
  - 采用WinUI3深色主题设计，背景使用渐变效果（rgba(10, 10, 10, 0.98)到rgba(26, 26, 46, 0.95)）
  - 添加毛玻璃效果（backdrop-filter: blur(20px)）增强视觉层次
  - 导航项添加悬停动画和活跃状态指示器
  - 实现阅读进度条，带动态光效动画

- **下拉菜单优化**：
  - 重新设计"更多选项"下拉菜单，采用渐变背景和毛玻璃效果
  - 添加展开/收起动画，使用cubic-bezier缓动函数
  - 菜单项添加悬停效果和滑动指示器

- **代码高亮优化**：
  - 代码块使用渐变背景和边框效果
  - 添加顶部装饰线条，增强视觉层次
  - 行内代码使用半透明背景和边框

- **响应式设计优化**：
  - 移动端侧边栏添加滑动动画和遮罩层
  - 优化小屏幕下的布局和字体大小
  - 移动端切换按钮使用渐变背景和阴影效果

- **视觉增强**：
  - 所有交互元素添加平滑过渡动画
  - 使用#0078d4（WinUI蓝）和#64ffda（荧光绿）作为强调色
  - 添加微妙的阴影和光效，提升整体质感
  - 保持深色主题一致性，避免使用浅色和渐变色

- **文件变更**：
  - 优化`client/src/pages/TechDocs.css`文件，重写1026行样式代码
  - 增强移动端体验，添加480px以下屏幕的额外适配
  - 保持与项目整体深色主题规范完全一致

### 2025-10-19 - 修复评论系统问题
**修改内容：**
- **修复顶栏闪烁问题**：
  - 移除Navbar.css中的backdrop-filter属性
  - 优化背景样式，解决滚动时重新计算模糊效果导致的性能问题

- **修复评论路由404错误**：
  - 统一前后端路由路径，从`/api/comments/worldview/{id}`改为`/api/comments/{id}`
  - 确保API调用路径一致性

- **修复回复显示问题**：
  - 将`replyTo.username`改为`replyTo.author?.username || '用户'`
  - 使用可选链操作符安全访问嵌套对象属性

### 2025-10-18 - 修复个人中心非公开世界观无法查看问题
**修改内容：**
- **问题分析**：
  - 个人中心和个人档案中，用户无法查看自己创建的非公开世界观
  - 原因是前端调用API路径错误，使用了获取指定用户世界观的API，该API只返回公开世界观
  
- **前端修复**：
  - 修改Profile.js中的API调用，从`/api/worldviews/user/${user.id}`改为`/api/worldviews/user`
  - 使用需要认证的API端点，可以获取当前用户的所有世界观（包括非公开的）
  - 添加注释说明使用认证API可查看所有世界观

- **后端修复**：
  - 调整世界观路由定义顺序，确保`/api/worldviews/user/:userId`在`/api/worldviews/user`之前
  - 保留`/api/worldviews/user`端点不设置isPublic过滤条件，可返回当前用户所有世界观
  - 保留`/api/worldviews/user/:userId`端点只返回公开世界观，符合安全设计

- **测试脚本**：
  - 创建`test.js/个人中心非公开世界观测试.js`测试脚本
  - 验证个人中心可以查看所有世界观（包括非公开的）
  - 验证其他用户查看个人档案只能看到公开世界观

### 2025-10-18 - 添加公开所有世界观脚本
- **功能描述**：创建test.js/公开所有世界观.js脚本，用于批量将数据库中所有非公开世界观设置为公开状态
- **脚本特点**：
  - 自动连接数据库并同步模型
  - 查询所有非公开世界观并显示详细信息
  - 批量更新非公开世界观为公开状态
  - 提供操作前后的统计信息
  - 包含完整的错误处理和数据库连接管理
- **测试结果**：脚本已成功测试，找到3个非公开世界观并将其全部设置为公开状态，现在数据库中所有5个世界观都是公开状态
- **使用场景**：适用于需要将所有内容公开的场景，如测试环境或特定管理需求
- **注意事项**：此操作不可逆，执行前请确认是否真的需要公开所有世界观

### 2025-10-18 - 表单验证和按钮禁用功能
**修改内容：**
- **创建世界观页面**：
  - 添加实时表单验证功能，检测标题、简介、内容是否完整
  - 在表单不完整时禁用提交按钮，防止无效提交
  - 按钮禁用状态有明确的视觉提示（灰色，透明度降低）

- **编辑世界观页面**：
  - 实现相同的表单验证逻辑
  - 保存按钮在表单不完整时自动禁用
  - 实时响应表单字段变化，动态更新按钮状态

- **样式优化**：
  - 按钮禁用状态符合项目深色主题规范
  - 添加适当的视觉反馈，提升用户体验
  - 保持与现有设计风格的一致性

### 2025-10-18 - 改进登录注册错误提示
**修改内容：**
- **后端改进**：
  - 登录时区分"邮箱未注册"和"密码错误"的具体提示
  - 注册时提供详细的验证失败原因，包括用户名格式、密码强度等
  - 增强用户名验证：只能包含字母、数字和下划线
  - 增强密码验证：必须包含大小写字母和数字
  - 改进错误响应格式，包含主消息和详细错误列表

- **前端改进**：
  - 更新AuthContext错误处理逻辑，支持新的错误格式
  - 能够正确显示多个具体错误信息
  - 保持与后端错误格式的一致性

- **错误提示优化**：
  - 从笼统的"登录失败"/"注册失败"改为具体原因提示
  - 支持显示多个验证错误
  - 提供更友好的用户反馈体验

### 2025-10-18 - 添加页面切换过渡动画
**修改内容：**
- 新增PageTransition组件，为所有页面切换添加平滑的淡入淡出动画
- 动画效果：0.3秒的淡入淡出过渡，包含轻微的垂直移动效果
- 所有路由页面都包裹在PageTransition组件中
- 符合项目深色主题规范，使用0.3秒ease过渡效果

### 2025-10-18 - 移除世界观详情页面的"关于作者"部分
**修改内容：**
- 从世界观详情页面完全移除"关于作者"部分
- 删除作者介绍卡片和相关个人信息显示
- 简化页面布局，专注于世界观内容本身

### 2025-10-18 - 移除个人资料页面的"我的世界观"选项卡
**修改内容：**
- 从个人资料页面(/profile)完全移除"我的世界观"选项卡
- 删除相关的状态管理(userWorldviews)和API调用
- 移除WorldviewCard组件的导入和使用
- 简化个人资料页面，只保留"编辑资料"和"修改密码"两个选项卡
- 清理不再需要的代码和注释，提高代码可维护性

### 2025-10-17 - 移除点赞和浏览人数功能
**修改内容：**
1. **世界观卡片**：
   - 完全移除点赞按钮和浏览人数显示
   - 简化卡片底部布局，只保留作者信息和编辑按钮

2. **评论区**：
   - 移除评论和回复的点赞功能
   - 保留回复功能，简化交互界面

3. **代码清理**：
   - 移除LikeButton组件相关代码
   - 清理相关的CSS样式
   - 优化组件结构

### 2025-10-17 - 界面优化和功能调整
**修改内容：**
1. **首页界面优化**：
   - 完全移除卡片样式，改为简洁的列表布局
   - 重新设计为卡片样式，包含标题、简介、分割线和作者信息
   - 添加作者头像显示（使用名称首字母）
   - 优化列表显示效果，提升视觉层次和可读性

2. **功能调整**：
   - 去除首页顶栏的"发布世界观"按钮
   - 保留页面底部的"发布世界观"按钮
   - 优化筛选区域和分页组件的显示效果
   - **移除投票系统**：删除所有投票相关功能，包括投票页面、投票模型和路由

3. **部署优化**：
   - 前后端服务成功部署并运行
   - 后端API服务运行在 http://localhost:5000
   - 前端应用运行在 http://localhost:3000



## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

# World Platform

A complete worldview publishing platform with user system and content management features.

## Features

- 🔐 Complete user registration/login system
- 🌍 Create, edit and publish worldviews
- 🔍 Browse and search worldviews
- 👤 User profile center
- 💬 Comment and interaction features
- 📱 Responsive design
- 🖼️ Avatar upload functionality
- 🎨 Custom CSS styling (presets + manual coding)

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL + Sequelize
- JWT Authentication
- bcrypt Password Encryption
- Multer File Upload

### Frontend
- React
- React Router
- Axios
- Modern UI Design

## Quick Start

1. Install dependencies
```bash
npm run install-all
```

2. Configure environment variables
```bash
cp .env.example .env
# Edit .env file to set database connection and other info
```

3. Start development servers
```bash
npm run dev
```

## Project Structure

```
world/
├── server/          # Backend code
│   ├── routes/      # API routes
│   ├── models/      # Data models
│   ├── middleware/  # Middleware
│   ├── config/      # Configuration
│   ├── DatabaseManager/ # Database management
│   └── uploads/     # File upload directory
├── client/          # Frontend code
│   ├── src/         # Source code
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Context
│   │   ├── services/   # Services
│   │   ├── styles/     # Styles
│   │   └── utils/      # Utilities
│   ├── public/      # Static resources
│   └── build/       # Build output
└── README.md        # Project documentation
```

## Environment Variables

- `DB_HOST` - Database host
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port (default: 5000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload user avatar
- `PUT /api/users/password` - Change password

### Worldviews
- `GET /api/worldviews` - Get worldview list
- `GET /api/worldviews/:id` - Get single worldview
- `POST /api/worldviews` - Publish worldview
- `PUT /api/worldviews/:id` - Update worldview
- `DELETE /api/worldviews/:id` - Delete worldview

### Comments
- `GET /api/comments/:worldviewId` - Get worldview comments
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Avatar Upload Feature

### Feature Description
Users can upload custom avatars on their profile page. The system automatically handles image upload, saving, and display.

### How to Use
1. Log in to your account
2. Go to profile page (/profile)
3. In the "Edit Profile" tab, find the avatar section
4. Click on the avatar area or upload button to select an image file
5. After confirming the upload, the avatar will update automatically

### Technical Implementation
- Frontend: React component `AvatarUpload` handles image preview and upload
- Backend: Express route `/api/users/avatar` handles file upload
- Storage: Using multer middleware, files are saved in `uploads/avatars` directory
- Limitations: Only image files are supported, maximum file size is 5MB

## Contributing

Issues and Pull Requests are welcome!

## License

MIT License

