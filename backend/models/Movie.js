import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    industry: { type: String, required: true },
    language: { type: String, required: true },
    genre: { type: String, required: true },
    cast: [String],
    director: { type: String, required: true },
    budget: { type: Number, required: true },
    revenue: { type: Number, required: true },
    rating: { type: Number, required: true },
    votes: { type: Number, required: true },
    ott_platform: { type: String, required: true },
    release_year: { type: Number, required: true },
    success: { type: String, required: true },
    cast_popularity: { type: Number, required: true },
    director_track_record: { type: Number, required: true },
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
