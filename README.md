# Worldview Platform - 世界观发布平台

一个完整的全栈世界观发布平台，支持用户创建、分享和讨论世界观。

**本项目完全由AI生成**

## 项目概述

Worldview Platform 是一个现代化的世界观发布平台，采用前后端分离架构，提供完整的用户认证、世界观管理、评论互动等功能。

### 技术栈

**后端 (Server)**
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT 认证
- Socket.IO 实时通信
- Multer 文件上传

**前端 (Client)**
- React 18
- Ant Design 组件库
- React Router 路由管理
- Axios HTTP 客户端

## 项目结构

```
worldview-platform/
├── client/                 # 前端 React 应用
│   ├── public/             # 静态资源
│   └── src/                # 源代码
├── server/                 # 后端 Node.js 应用
│   ├── config/             # 配置文件
│   ├── DatabaseManager/    # 数据库管理
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   └── uploads/            # 上传文件存储
├── test.js/                # 测试脚本目录
├── API文档.md              # API 接口文档
├── CSS选择器总结.md        # CSS 样式规范
├── 基本主题规范.txt        # 项目主题规范
├── 项目主题规范.md         # 详细样式指南
└── package.json            # 项目配置
```

## 功能特性

### 用户系统
- 用户注册与登录
- JWT 身份认证
- 用户资料管理
- 头像上传功能

### 世界观管理
- 创建和编辑世界观
- 世界观分类和标签
- 富文本编辑器支持
- 图片上传和展示

### 社交功能
- 评论和回复系统
- 点赞和收藏功能
- 实时通知系统
- 用户关注功能

### 技术特性
- 响应式设计
- 深色主题界面
- 实时通信支持
- 文件上传和存储

## 快速开始

### 环境要求
- Node.js 16+
- MongoDB 4.4+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd worldview-platform
```

2. **安装依赖**
```bash
# 安装所有依赖（前后端）
npm run install-all

# 或分别安装
npm install
cd client && npm install
```

3. **环境配置**
复制 `.env.example` 为 `.env` 并配置数据库连接：
```env
MONGODB_URI=mongodb://localhost:27017/worldview-platform
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. **启动应用**
```bash
# 开发模式（同时启动前后端）
npm run dev

# 或分别启动
npm run server  # 后端服务 (端口 5000)
npm run client  # 前端服务 (端口 3000)
```

5. **访问应用**
- 前端应用: http://localhost:3000
- 后端API: http://localhost:5000

## API 文档

详细的 API 接口文档请参考 [API文档.md](./API文档.md)

## 主题规范

项目采用深色主题设计，具体规范请参考：
- [基本主题规范.txt](./基本主题规范.txt)
- [项目主题规范.md](./项目主题规范.md)

### 主要颜色
- 主色调: #1a1a1a, #2a2a2a, #333333
- 文字颜色: #e0e0e0, #ffffff
- 强调色: #64ffda, #00bcd4

### 设计原则
- 仅使用深色主题，禁止浅色主题
- 禁止使用渐变色
- 保持界面简洁现代
- 所有组件保持统一视觉风格

## 测试脚本

所有测试脚本都位于 `test.js/` 目录下，每个脚本都有对应的说明文档。

### 当前测试脚本
- 暂无测试脚本（目录为空）

## 开发指南

### 代码风格
- 使用一致的代码缩进和命名规范
- 遵循项目主题规范
- 保持组件和函数的单一职责

### 提交规范
- 提交信息使用英文或中文
- 描述清晰的变更内容
- 关联相关的 issue 或功能

## 部署说明

### 生产环境部署
1. 构建前端应用
```bash
cd client
npm run build
```

2. 配置生产环境变量
3. 使用 PM2 或其他进程管理器启动后端服务

### Docker 部署（可选）
项目支持 Docker 容器化部署，具体配置参考 Dockerfile。

## 许可证

本项目基于 MIT 许可证开源，详见 [LICENSE](./LICENSE) 文件。

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

## 更新日志

### 最新更新
- 项目初始化
- 基础架构搭建完成
- 用户认证系统实现
- 世界观管理功能
- 评论和社交功能

---

**注意**: 本项目仅用于学习和开发目的，请勿未经授权上传到 GitHub 或其他代码托管平台。