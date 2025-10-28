
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const worldviewRoutes = require('./routes/worldviews');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/upload');
const notificationRoutes = require('./routes/notifications');

const app = express();

// 中间件
// 使用 cors 中间件统一处理跨域（包括预检）
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// 动态检查 origin，允许 localhost / 127.0.0.1 / 局域网 192.168.x.x 的请求（便于在局域网内通过 IP 访问开发服务器）
// 允许所有 origin 并回显请求的 Origin（Access-Control-Allow-Origin: <request-origin>），
// 这样在公网部署时前端任意域名访问都有效，同时仍可开启 credentials（cookie）支持。
// 注意：这在安全上等于不开启 origin 限制，请确保后端有其他认证/授权措施。
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 确保预检请求也会走 cors 中间件并返回 204
app.options('*', cors());

// JSON解析中间件，但跳过文件上传请求
app.use((req, res, next) => {
  if (req.path.includes('/upload') || req.path.includes('/avatar')) {
    return next();
  }
  express.json()(req, res, next);
});

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // 静态文件的缓存控制等，由 cors 中间件统一处理跨域头，避免重复或冲突
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // 根据文件类型设置Content-Type
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

// 连接数据库
connectDB();

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/worldviews', worldviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/api/notifications', notificationRoutes);

// 默认路由
app.get('/', (req, res) => {
  res.send('世界观发布平台 API 运行中');
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({ 
      message: '数据验证失败', 
      errors 
    });
  }
  
  // Sequelize 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} 已存在`
    }));
    return res.status(400).json({ 
      message: '数据唯一性验证失败', 
      errors 
    });
  }
  
  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: '无效的访问令牌' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: '访问令牌已过期' });
  }
  
  // 默认错误
  res.status(err.status || 500).json({ 
    message: err.message || '服务器内部错误' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});