import express from 'express';

const router = express.Router();

// Get list of movies with filters
router.get('/', (req, res) => {
    const { industry, genre, year, language, limit = 50 } = req.query;
    let filteredMovies = req.app.locals.movies;

    if (industry) filteredMovies = filteredMovies.filter(m => m.industry === industry);
    if (genre) filteredMovies = filteredMovies.filter(m => m.genre === genre);
    if (year) filteredMovies = filteredMovies.filter(m => m.release_year === parseInt(year));
    if (language) filteredMovies = filteredMovies.filter(m => m.language === language);

    res.json(filteredMovies.slice(0, parseInt(limit)));
});

// Single movie detail
router.get('/:id', (req, res) => {
    const movie = req.app.locals.movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
});

// Recommendation engine (Simplified)
router.get('/recommend', (req, res) => {
    const { genre, actor, mood, ott_platform, ratings, industry, query } = req.query;
    let filteredMovies = req.app.locals.movies;

    if (query) {
        const q = query.toLowerCase();
        filteredMovies = filteredMovies.filter(m => m.title.toLowerCase().includes(q));
    }
    if (genre) filteredMovies = filteredMovies.filter(m => m.genre === genre);
    if (industry) filteredMovies = filteredMovies.filter(m => m.industry === industry);
    if (actor) filteredMovies = filteredMovies.filter(m => m.cast.includes(actor));
    if (ott_platform) filteredMovies = filteredMovies.filter(m => m.ott_platform === ott_platform);
    if (ratings) filteredMovies = filteredMovies.filter(m => m.rating >= parseFloat(ratings));

    res.json(filteredMovies.sort((a, b) => b.rating - a.rating).slice(0, 20));
});

export default router;
