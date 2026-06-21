const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM about_content ORDER BY id DESC LIMIT 1');
    if (!rows[0]) return res.json({ description: '', mission: '', facility: [], quality: [] });
    const r = rows[0];
    res.json({
      description: r.description || '',
      mission: r.mission || '',
      facility: JSON.parse(r.facility || '[]'),
      quality: JSON.parse(r.quality || '[]')
    });
  } catch (err) { res.status(500).json({ error: '获取失败' }); }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { description, mission, facility, quality } = req.body;
    const [existing] = await pool.query('SELECT id FROM about_content ORDER BY id DESC LIMIT 1');
    if (existing.length > 0) {
      await pool.query('UPDATE about_content SET description=?, mission=?, facility=?, quality=? WHERE id=?',
        [description, mission, JSON.stringify(facility || []), JSON.stringify(quality || []), existing[0].id]);
    } else {
      await pool.query('INSERT INTO about_content (description, mission, facility, quality) VALUES (?,?,?,?)',
        [description, mission, JSON.stringify(facility || []), JSON.stringify(quality || [])]);
    }
    res.json({ message: '保存成功' });
  } catch (err) { res.status(500).json({ error: '保存失败' }); }
});

module.exports = router;
