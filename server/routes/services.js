const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY sort_order');
    res.json(rows.map(r => ({ ...r, features: JSON.parse(r.features || '[]') })));
  } catch (err) { res.status(500).json({ error: '获取失败' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, features, image } = req.body;
    const [result] = await pool.query('INSERT INTO services (title, description, features, image) VALUES (?,?,?,?)', [title, description, JSON.stringify(features || []), image || '']);
    res.json({ id: result.insertId, message: '添加成功' });
  } catch (err) { res.status(500).json({ error: '添加失败' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, features, image } = req.body;
    await pool.query('UPDATE services SET title=?, description=?, features=?, image=? WHERE id=?', [title, description, JSON.stringify(features || []), image || '', req.params.id]);
    res.json({ message: '更新成功' });
  } catch (err) { res.status(500).json({ error: '更新失败' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try { await pool.query('DELETE FROM services WHERE id=?', [req.params.id]); res.json({ message: '删除成功' }); }
  catch (err) { res.status(500).json({ error: '删除失败' }); }
});

router.put('/reorder/:id', authMiddleware, async (req, res) => {
  try { await pool.query('UPDATE services SET sort_order=? WHERE id=?', [req.body.sort_order, req.params.id]); res.json({ message: '排序已更新' }); }
  catch (err) { res.status(500).json({ error: '排序失败' }); }
});

module.exports = router;
