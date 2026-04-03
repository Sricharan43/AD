import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config({ path: path.join(path.resolve(), 'backend', '.env') });

const __dirname = path.resolve();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Load data
        const dataPath = path.join(__dirname, '..', 'dataset', 'movies.json');
        const movies = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        // Clear existing data
        await Movie.deleteMany({});
        console.log('Old movies removed');

        // Insert new data
        await Movie.insertMany(movies);
        console.log(`${movies.length} movies seeded successfully!`);

        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedDB();
