import express from 'express';

const router = express.Router();

// Get top actors by average revenue
router.get('/', (req, res) => {
    const movies = req.app.locals.movies;
    const actorsMap = {};

    movies.forEach(movie => {
        movie.cast.forEach(actor => {
            if (!actorsMap[actor]) {
                actorsMap[actor] = { 
                    _id: actor, 
                    totalRevenue: 0, 
                    movieCount: 0,
                    industries: new Set()
                };
            }
            actorsMap[actor].totalRevenue += movie.revenue;
            actorsMap[actor].movieCount += 1;
            actorsMap[actor].industries.add(movie.industry);
        });
    });

    const result = Object.values(actorsMap).map(actor => ({
        ...actor,
        avgRevenue: actor.totalRevenue / actor.movieCount,
        industries: Array.from(actor.industries)
    })).sort((a, b) => b.avgRevenue - a.avgRevenue).slice(0, 100);

    res.json(result);
});

// Get top directors by success rate
router.get('/directors', (req, res) => {
    const movies = req.app.locals.movies;
    const directorsMap = {};

    movies.forEach(movie => {
        const director = movie.director;
        if (!directorsMap[director]) {
            directorsMap[director] = { 
                _id: director, 
                totalRevenue: 0, 
                hitCount: 0,
                movieCount: 0
            };
        }
        directorsMap[director].totalRevenue += movie.revenue;
        directorsMap[director].movieCount += 1;
        if (movie.success === 'Hit') {
            directorsMap[director].hitCount += 1;
        }
    });

    const result = Object.values(directorsMap).map(director => ({
        ...director,
        avgRevenue: director.totalRevenue / director.movieCount,
        successRate: director.hitCount / director.movieCount
    })).sort((a, b) => b.successRate - a.successRate || b.avgRevenue - a.avgRevenue).slice(0, 100);

    res.json(result);
});

export default router;
