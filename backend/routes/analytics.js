const express = require('express');
const router = express.Router();

// Dashboard Summary & Charts
router.get('/dashboard', (req, res) => {
  const db = req.app.get('db');
  try {
    const totalMovies = db.prepare('SELECT COUNT(*) as count FROM movies').get().count;
    const totalActors = db.prepare('SELECT COUNT(*) as count FROM actors').get().count;
    const totalDirectors = db.prepare('SELECT COUNT(*) as count FROM directors').get().count;
    const avgRating = db.prepare('SELECT AVG(imdbRating) as avg FROM movies').get().avg;
    const totalRevenue = db.prepare('SELECT SUM(revenue) as total FROM movies').get().total;

    // Budget vs Revenue (Top 20)
    const budgetVsRevenue = db.prepare(`
      SELECT title, budget, revenue 
      FROM movies 
      ORDER BY revenue DESC 
      LIMIT 20
    `).all();

    // Industry Share
    const industryShare = db.prepare(`
      SELECT industry as name, SUM(revenue) as value 
      FROM movies 
      GROUP BY industry
    `).all();

    // Year-wise Hit Trend (Revenue > 1.5 * Budget)
    const hitTrend = db.prepare(`
      SELECT year, COUNT(*) as count 
      FROM movies 
      WHERE revenue > (budget * 1.5) 
      GROUP BY year 
      ORDER BY year ASC
    `).all();

    // Genre Profitability
    const movies = db.prepare('SELECT genres, revenue FROM movies').all();
    const genreStats = {};
    movies.forEach(m => {
      const genres = m.genres ? m.genres.split(',') : [];
      genres.forEach(g => {
        if (!genreStats[g]) genreStats[g] = { name: g, totalRevenue: 0, count: 0 };
        genreStats[g].totalRevenue += m.revenue;
        genreStats[g].count += 1;
      });
    });
    const genreProfitability = Object.values(genreStats)
      .map(s => ({ name: s.name, avgRevenue: s.totalRevenue / s.count }))
      .sort((a, b) => b.avgRevenue - a.avgRevenue)
      .slice(0, 10);

    res.json({
      summary: {
        totalMovies,
        totalTalent: totalActors + totalDirectors,
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalRevenue
      },
      charts: {
        budgetVsRevenue,
        industryShare,
        hitTrend,
        genreProfitability
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/boxoffice', (req, res) => {
  const db = req.app.get('db');
  try {
    const { industry } = req.query;
    let query = 'SELECT budget, revenue, industry, genres, title, year FROM movies';
    let params = [];
    
    if (industry) {
      query += ' WHERE industry = ?';
      params.push(industry);
    }

    const movies = db.prepare(query).all(params);

    // Scatter Plot Data
    const scatterData = movies.map(m => ({
      budget: m.budget / 1000000,
      revenue: m.revenue / 1000000,
      title: m.title
    }));

    // Industry revenue comparison
    const industryComp = db.prepare(`
      SELECT industry, SUM(revenue) as revenue, SUM(budget) as budget 
      FROM movies 
      GROUP BY industry
    `).all();

    // Hit vs Flop Ratio (Hit: Rev > Budget, Flop: Rev < Budget)
    const stats = movies.reduce((acc, m) => {
      if (m.revenue > m.budget) acc.hits += 1;
      else acc.flops += 1;
      return acc;
    }, { hits: 0, flops: 0 });

    res.json({
      scatterData,
      industryComp,
      ratio: [
        { name: 'Hits', value: stats.hits },
        { name: 'Flops', value: stats.flops }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

