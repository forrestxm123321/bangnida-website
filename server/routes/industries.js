const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM industries ORDER BY sort_order'); res.json(rows); }
  catch (err) { res.status(500).json({ error: '获取失败' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const [result] = await pool.query('INSERT INTO industries (title, description, image) VALUES (?,?,?)', [title, description || '', image || '']);
    res.json({ id: result.insertId, message: '添加成功' });
  } catch (err) { res.status(500).json({ error: '添加失败' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    await pool.query('UPDATE industries SET title=?, description=?, image=? WHERE id=?', [title, description || '', image || '', req.params.id]);
    res.json({ message: '更新成功' });
  } catch (err) { res.status(500).json({ error: '更新失败' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try { await pool.query('DELETE FROM industries WHERE id=?', [req.params.id]); res.json({ message: '删除成功' }); }
  catch (err) { res.status(500).json({ error: '删除失败' }); }
});

module.exports = router;
