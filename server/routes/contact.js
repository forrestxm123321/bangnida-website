const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_info ORDER BY id DESC LIMIT 1');
    if (!rows[0]) return res.json({ company_name: '', address: '', phone: '', email: '', working_hours: '', social: {} });
    const r = rows[0];
    res.json({ ...r, social: JSON.parse(r.social || '{}') });
  } catch (err) { res.status(500).json({ error: '获取失败' }); }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { company_name, address, phone, email, working_hours, social } = req.body;
    const [existing] = await pool.query('SELECT id FROM contact_info ORDER BY id DESC LIMIT 1');
    if (existing.length > 0) {
      await pool.query('UPDATE contact_info SET company_name=?, address=?, phone=?, email=?, working_hours=?, social=? WHERE id=?',
        [company_name, address, phone, email, working_hours, JSON.stringify(social || {}), existing[0].id]);
    } else {
      await pool.query('INSERT INTO contact_info (company_name, address, phone, email, working_hours, social) VALUES (?,?,?,?,?,?)',
        [company_name, address, phone, email, working_hours, JSON.stringify(social || {})]);
    }
    res.json({ message: '保存成功' });
  } catch (err) { res.status(500).json({ error: '保存失败' }); }
});

module.exports = router;
