import express from 'express';

const router = express.Router();

// Dashboard KPI metrics
router.get('/dashboard', (req, res) => {
    const movies = req.app.locals.movies;
    const totalMovies = movies.length;
    const industries = [...new Set(movies.map(m => m.industry))];
    const industriesCount = industries.length;

    const avgRevenueByIndustry = industries.map(ind => {
        const indMovies = movies.filter(m => m.industry === ind);
        const avg = indMovies.reduce((acc, current) => acc + current.revenue, 0) / indMovies.length;
        return { _id: ind, avgRevenue: avg };
    });

    const budgetVsRevenue = [...movies].sort((a, b) => b.revenue - a.revenue).slice(0, 10).map(m => ({
        budget: m.budget,
        revenue: m.revenue,
        title: m.title
    }));

    res.json({
        totalMovies,
        industriesCount,
        avgRevenueByIndustry,
        budgetVsRevenue
    });
});

// Genre vs Revenue
router.get('/genre-revenue', (req, res) => {
    const movies = req.app.locals.movies;
    const genres = [...new Set(movies.map(m => m.genre))];
    const result = genres.map(g => {
        const genMovies = movies.filter(m => m.genre === g);
        const avg = genMovies.reduce((acc, current) => acc + current.revenue, 0) / genMovies.length;
        return { _id: g, averageRevenue: avg, count: genMovies.length };
    });
    res.json(result);
});

// Yearly Trends
router.get('/yearly-trends', (req, res) => {
    const movies = req.app.locals.movies;
    const years = [...new Set(movies.map(m => m.release_year))].sort();
    const result = years.map(y => {
        const yearMovies = movies.filter(m => m.release_year === y);
        const hitCount = yearMovies.filter(m => m.success === 'Hit').length;
        return { _id: y, count: yearMovies.length, hitCount };
    });
    res.json(result);
});

// OTT vs Theatre performance
router.get('/ott-vs-theatre', (req, res) => {
    const movies = req.app.locals.movies;
    const otts = [...new Set(movies.map(m => m.ott_platform))];
    const result = otts.map(o => {
        const ottMovies = movies.filter(m => m.ott_platform === o);
        const avgRating = ottMovies.reduce((acc, current) => acc + current.rating, 0) / ottMovies.length;
        const avgRevenue = ottMovies.reduce((acc, current) => acc + current.revenue, 0) / ottMovies.length;
        return { _id: o, avgRating, avgRevenue };
    });
    res.json(result);
});

export default router;
