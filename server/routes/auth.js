// ==========================================
// 管理员登录 API
// ==========================================
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const config = require('../config/config');

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: '用户名或密码错误' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: '用户名或密码错误' });

    const token = jwt.sign({ id: rows[0].id, username }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 验证token中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (e) {
    res.status(401).json({ error: '登录已过期' });
  }
};

// 修改密码
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(oldPassword, rows[0].password);
    if (!valid) return res.status(400).json({ error: '原密码错误' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin_users SET password = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: '密码修改成功' });
  } catch (err) {
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
