// ==========================================
// 图片上传 API
// ==========================================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const { authMiddleware } = require('./auth');

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) cb(null, true);
    else cb(new Error('仅支持 JPG/PNG/WebP/SVG 格式'));
  }
});

// 上传图片
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '请选择图片' });
    const fileUrl = '/uploads/' + req.file.filename;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 上传并关联到指定 key (logo/banner1/banner2/banner3)
router.post('/:key', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '请选择图片' });
    const fileUrl = '/uploads/' + req.file.filename;

    await pool.query(
      'INSERT INTO images (image_key, file_name, file_path) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE file_name = ?, file_path = ?',
      [req.params.key, req.file.filename, fileUrl, req.file.filename, fileUrl]
    );
    res.json({ key: req.params.key, url: fileUrl, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
