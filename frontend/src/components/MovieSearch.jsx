import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Play, Layers } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        query: '',
        genre: '',
        industry: '',
        rating: 0,
        ott: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMovies();
        }, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.query) params.append('query', filters.query);
            if (filters.genre) params.append('genre', filters.genre);
            if (filters.industry) params.append('industry', filters.industry);
            if (filters.rating) params.append('ratings', filters.rating);
            if (filters.ott) params.append('ott_platform', filters.ott);

            const response = await axios.get(`${API_URL}/movies/recommend?${params.toString()}`);
            setMovies(response.data);
        } catch (err) {
            console.error('Error fetching movies:', err);
        } finally {
            setLoading(false);
        }
    };

    const genres = ["Action", "Drama", "Romance", "Comedy", "Thriller", "Horror", "Sci-Fi", "Fantasy", "Crime", "Family", "Biography", "Sports", "Historical"];
    const industries = ["Bollywood", "Tollywood", "Kollywood", "Mollywood", "Sandalwood"];
    const otts = ["Netflix", "Amazon Prime", "Disney+ Hotstar", "ZEE5", "SonyLIV", "Aha", "MX Player", "Apple TV+", "Theatre Only"];

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="glass p-6 rounded-2xl flex flex-wrap gap-4 items-center border border-slate-800">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find your movie..." 
                            value={filters.query}
                            onChange={(e) => setFilters({...filters, query: e.target.value})}
                            className="w-full bg-slate-800 border boder-slate-700 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <select 
                    className="bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm"
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                >
                    <option value="">All Genres</option>
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                <select 
                    className="bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm"
                    onChange={(e) => setFilters({...filters, industry: e.target.value})}
                >
                    <option value="">All Industries</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>

                <select 
                    className="bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm"
                    onChange={(e) => setFilters({...filters, ott: e.target.value})}
                >
                    <option value="">All Platforms</option>
                    {otts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="text-center py-20">Loading findings...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {(movies || []).map((movie) => (
                        <div key={movie.id} className="glass rounded-2xl overflow-hidden card-hover border border-slate-800">
                            <div className="relative aspect-[2/3] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center p-4 text-center">
                                <div className="z-10">
                                    <h4 className="text-lg font-bold text-white line-clamp-3 leading-tight">{movie.title}</h4>
                                    <p className="text-slate-400 text-xs mt-2">{movie.industry} • {movie.genre}</p>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="bg-blue-600 p-3 rounded-full shadow-lg">
                                        <Play fill="white" size={20} />
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-slate-900/80 px-2 py-1 rounded text-xs border border-white/10 flex items-center gap-1">
                                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                    {movie.rating}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-900/50">
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>{movie.release_year}</span>
                                    <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{movie.ott_platform}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieSearch;
