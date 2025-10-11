# WorldView Platform - 世界观发布平台

一个完整的世界观发布平台，包含用户系统和内容管理功能。

## 功能特性 | Features

- 🔐 完整的用户注册/登录系统 | Complete user registration/login system
- 🌍 世界观创建、编辑和发布 | Create, edit and publish worldviews
- 🔍 世界观浏览和搜索 | Browse and search worldviews
- 👤 用户个人中心 | User profile center
- 💬 评论和互动功能 | Comment and interaction features
- 📱 响应式设计 | Responsive design
- 🖼️ 头像上传功能 | Avatar upload functionality

## 技术栈 | Tech Stack

### 后端 | Backend
- Node.js + Express
- PostgreSQL + Sequelize
- JWT 身份验证 | JWT Authentication
- bcrypt 密码加密 | bcrypt Password Encryption
- Multer 文件上传 | Multer File Upload

### 前端 | Frontend
- React
- React Router
- Axios
- 现代化 UI 设计 | Modern UI Design

## 快速开始 | Quick Start

1. 安装依赖 | Install dependencies
```bash
npm run install-all
```

2. 配置环境变量 | Configure environment variables
```bash
cp .env.example .env
# 编辑 .env 文件，设置数据库连接等信息
# Edit .env file to set database connection and other info
```

3. 启动开发服务器 | Start development servers
```bash
npm run dev
```

## 项目结构 | Project Structure

```
worldview-platform/
├── server/          # 后端代码 | Backend code
│   ├── routes/      # API路由 | API routes
│   ├── models/      # 数据模型 | Data models
│   ├── middleware/  # 中间件 | Middleware
│   └── uploads/     # 文件上传目录 | File upload directory
├── client/          # 前端代码 | Frontend code
│   ├── src/         # 源代码 | Source code
│   │   ├── components/ # React组件 | React components
│   │   ├── pages/      # 页面组件 | Page components
│   │   └── context/    # 上下文 | Context
└── README.md        # 项目文档 | Project documentation
```

## 环境变量 | Environment Variables

- `DB_HOST` - 数据库主机 | Database host
- `DB_NAME` - 数据库名称 | Database name
- `DB_USER` - 数据库用户 | Database user
- `DB_PASSWORD` - 数据库密码 | Database password
- `JWT_SECRET` - JWT 密钥 | JWT secret key
- `PORT` - 服务器端口（默认：5000）| Server port (default: 5000)

## API 端点 | API Endpoints

### 认证 | Authentication
- `POST /api/auth/register` - 用户注册 | User registration
- `POST /api/auth/login` - 用户登录 | User login
- `GET /api/auth/user` - 获取当前用户 | Get current user

### 用户 | Users
- `GET /api/users/profile` - 获取用户资料 | Get user profile
- `PUT /api/users/profile` - 更新用户资料 | Update user profile
- `POST /api/users/avatar` - 上传用户头像 | Upload user avatar
- `PUT /api/users/password` - 修改密码 | Change password

### 世界观 | Worldviews
- `GET /api/worldviews` - 获取世界观列表 | Get worldview list
- `GET /api/worldviews/:id` - 获取单个世界观 | Get single worldview
- `POST /api/worldviews` - 创建世界观 | Create worldview
- `PUT /api/worldviews/:id` - 更新世界观 | Update worldview
- `DELETE /api/worldviews/:id` - 删除世界观 | Delete worldview

### 评论 | Comments
- `GET /api/comments/:worldviewId` - 获取世界观评论 | Get worldview comments
- `POST /api/comments` - 添加评论 | Add comment
- `PUT /api/comments/:id` - 更新评论 | Update comment
- `DELETE /api/comments/:id` - 删除评论 | Delete comment

## 头像上传功能 | Avatar Upload Feature

### 功能说明 | Feature Description
用户可以在个人资料页面上传自定义头像，系统会自动处理图片上传、保存和显示。

Users can upload custom avatars on their profile page. The system automatically handles image upload, saving, and display.

### 使用方法 | How to Use
1. 登录账户 | Log in to your account
2. 访问个人资料页面 (/profile) | Go to profile page (/profile)
3. 在"编辑资料"标签页中，找到头像部分 | In the "Edit Profile" tab, find the avatar section
4. 点击头像区域或上传按钮选择图片文件 | Click on the avatar area or upload button to select an image file
5. 确认上传后，头像会自动更新 | After confirming the upload, the avatar will update automatically

### 技术实现 | Technical Implementation
- 前端：React组件`AvatarUpload`处理图片预览和上传 | Frontend: React component `AvatarUpload` handles image preview and upload
- 后端：Express路由`/api/users/avatar`处理文件上传 | Backend: Express route `/api/users/avatar` handles file upload
- 存储：使用multer中间件，文件保存在`uploads/avatars`目录 | Storage: Using multer middleware, files are saved in `uploads/avatars` directory
- 限制：仅支持图片文件，最大文件大小5MB | Limitations: Only image files are supported, maximum file size is 5MB

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

## 许可证 | License

MIT License