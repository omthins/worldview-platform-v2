const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器，只允许图片
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: fileFilter
});

// 图片上传路由
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errors: [{ msg: '没有上传文件' }] });
    }

    // 构建图片URL
    const imageUrl = `/uploads/images/${req.file.filename}`;
    
    res.json({ imageUrl });
  } catch (err) {
    console.error('图片上传错误:', err);
    res.status(500).json({ errors: [{ msg: '服务器错误' }] });
  }
});

// 错误处理中间件
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ errors: [{ msg: '文件大小超过限制（5MB）' }] });
    }
  }
  
  if (err.message === '只允许上传图片文件') {
    return res.status(400).json({ errors: [{ msg: err.message }] });
  }
  
  res.status(500).json({ errors: [{ msg: '服务器错误' }] });
});

module.exports = router;