const express = require('express');
const router = express.Router();

router.get('/top', (req, res) => {
  const db = req.app.get('db');
  try {
    const { sortBy = 'averageRevenue' } = req.query;
    const directors = db.prepare(`SELECT * FROM directors ORDER BY ${sortBy} DESC LIMIT 50`).all();
    res.json(directors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

