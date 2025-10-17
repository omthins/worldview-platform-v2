# WorldView Platform - 世界观发布平台

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


## 技术栈

### 后端
- Node.js + Express
- PostgreSQL + Sequelize
- JWT 身份验证
- bcrypt 密码加密
- Multer 文件上传

### 前端
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
worldview-platform/
├── server/          # 后端代码
│   ├── routes/      # API路由
│   ├── models/      # 数据模型
│   ├── middleware/  # 中间件
│   └── uploads/     # 文件上传目录
├── client/          # 前端代码
│   ├── src/         # 源代码
│   │   ├── components/ # React组件
│   │   ├── pages/      # 页面组件
│   │   └── context/    # 上下文
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

# WorldView Platform

A complete worldview publishing platform with user system and content management features.

## Features

- 🔐 Complete user registration/login system
- 🌍 Create, edit and publish worldviews
- 🔍 Browse and search worldviews
- 👤 User profile center
- 💬 Comment and interaction features
- 📱 Responsive design
- 🖼️ Avatar upload functionality

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
worldview-platform/
├── server/          # Backend code
│   ├── routes/      # API routes
│   ├── models/      # Data models
│   ├── middleware/  # Middleware
│   └── uploads/     # File upload directory
├── client/          # Frontend code
│   ├── src/         # Source code
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   └── context/    # Context
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