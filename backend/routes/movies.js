const express = require('express');
const router = express.Router();

// Search & Filter Movies
router.get('/', (req, res) => {
  const db = req.app.get('db');
  try {
    const { industry, genre, search, sortBy, order = 'DESC' } = req.query;
    let query = 'SELECT * FROM movies WHERE 1=1';
    let params = [];

    if (industry) {
      query += ' AND industry = ?';
      params.push(industry);
    }
    if (genre) {
      query += ' AND genres LIKE ?';
      params.push(`%${genre}%`);
    }
    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    const allowedSortFields = ['imdbRating', 'revenue', 'year', 'budget'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      query += ` ORDER BY ${sortBy} ${order === 'ASC' ? 'ASC' : 'DESC'}`;
    } else {
      query += ' ORDER BY revenue DESC';
    }

    query += ' LIMIT 100';
    const movies = db.prepare(query).all(params);
    res.json(movies.map(m => ({
      ...m,
      genres: m.genres ? m.genres.split(',') : [],
      actors: m.actors ? m.actors.split(',') : []
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Advanced Recommendations
router.get('/recommend', (req, res) => {
  const db = req.app.get('db');
  try {
    const { genre, actor, industry, rating, movieId } = req.query;
    let query = 'SELECT * FROM movies WHERE 1=1';
    let params = [];

    if (movieId) {
      query += ' AND id != ?';
      params.push(movieId);
    }

    if (genre) {
      query += ' AND genres LIKE ?';
      params.push(`%${genre}%`);
    }
    if (actor) {
      query += ' AND actors LIKE ?';
      params.push(`%${actor}%`);
    }
    if (industry) {
      query += ' AND industry = ?';
      params.push(industry);
    }
    if (rating) {
      query += ' AND imdbRating >= ?';
      params.push(Number(rating));
    }

    query += ' ORDER BY imdbRating DESC LIMIT 12';
    const movies = db.prepare(query).all(params);
    res.json(movies.map(m => ({
      ...m,
      genres: m.genres ? m.genres.split(',') : [],
      actors: m.actors ? m.actors.split(',') : []
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  const db = req.app.get('db');
  try {
    const movie = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    
    res.json({
      ...movie,
      genres: movie.genres ? movie.genres.split(',') : [],
      actors: movie.actors ? movie.actors.split(',') : []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

