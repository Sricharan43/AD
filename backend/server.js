import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import movieRoutes from './routes/movies.js';
import analyticsRoutes from './routes/analytics.js';
import actorRoutes from './routes/actors.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load data into memory
const dataPath = '/Users/AD/dataset/movies.json';
let movies = [];
try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    movies = JSON.parse(data);
    console.log(`Loaded ${movies.length} movies from dataset`);
} catch (err) {
    console.error('Error loading dataset:', err);
}

// Make movies data accessible globally for simplified routes
app.locals.movies = movies;

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/actors', actorRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: 'json-mock', count: movies.length });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
