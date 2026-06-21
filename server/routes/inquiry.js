// ==========================================
// Bangnida - Contact/Quote Form Submission API
// ==========================================
const express = require('express');
const router = express.Router();
const pool = require('../db');

// 提交联系表单
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;
    if (!name || !email || !message || !subject) {
      return res.status(400).json({ error: '请填写必填字段' });
    }
    const [result] = await pool.query(
      `INSERT INTO inquiries (type, name, email, phone, company, subject, message)
       VALUES ('contact', ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || '', company || '', subject, message]
    );
    res.json({ message: 'Message sent successfully! We will get back to you within 24 hours.', id: result.insertId });
  } catch (err) {
    console.error('Contact inquiry error:', err);
    res.status(500).json({ error: 'Submission failed. Please email us directly at info@bangnida.com' });
  }
});

// 提交报价表单
router.post('/quote', async (req, res) => {
  try {
    const { name, email, phone, company, partname, quantity, material, tolerance, finish, notes } = req.body;
    if (!name || !email || !partname || !quantity || !material) {
      return res.status(400).json({ error: '请填写必填字段' });
    }
    const details = JSON.stringify({ tolerance: tolerance || '', finish: finish || '', notes: notes || '' });
    const [result] = await pool.query(
      `INSERT INTO inquiries (type, name, email, phone, company, subject, message)
       VALUES ('quote', ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || '', company || '', `Quote Request: ${partname} (Qty: ${quantity}, Material: ${material})`, details]
    );
    res.json({ message: 'Quote request submitted successfully! Our team will respond within 24 hours.', id: result.insertId });
  } catch (err) {
    console.error('Quote inquiry error:', err);
    res.status(500).json({ error: 'Submission failed. Please email us directly at info@bangnida.com' });
  }
});

// 获取所有提交（管理后台用）
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: '获取失败' });
  }
});

module.exports = router;
