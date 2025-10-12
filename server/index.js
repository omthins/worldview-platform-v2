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

const app = express();

// 中间件
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// JSON解析中间件，但跳过文件上传请求
app.use((req, res, next) => {
  if (req.path.includes('/upload') || req.path.includes('/avatar')) {
    return next();
  }
  express.json()(req, res, next);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

// 连接数据库
connectDB();

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/worldviews', worldviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);

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