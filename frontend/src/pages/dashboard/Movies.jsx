import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Filter, Star, DollarSign, PlayCircle, ExternalLink, 
  ChevronRight, ArrowUpDown, Film, X, Calendar
} from 'lucide-react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    genre: '',
    sortBy: 'revenue',
    order: 'DESC'
  });

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/movies', { 
        params: { ...filters, search } 
      });
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchMovies();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search & Action Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="w-full lg:max-w-xl relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, actor or director..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-[#0a0a0a] border border-gray-800 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 shadow-2xl transition-all font-medium"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <FilterGroup 
            label="Industry" 
            value={filters.industry} 
            onChange={(v) => setFilters({...filters, industry: v})}
            options={['Bollywood', 'Tollywood', 'Kollywood', 'Mollywood']}
          />
          <FilterGroup 
            label="Genre" 
            value={filters.genre} 
            onChange={(v) => setFilters({...filters, genre: v})}
            options={['Action', 'Drama', 'Thriller', 'Comedy', 'Sci-Fi']}
          />
          <FilterGroup 
            label="Sort By" 
            value={filters.sortBy} 
            onChange={(v) => setFilters({...filters, sortBy: v})}
            options={[
              {label: 'Rating', value: 'imdbRating'},
              {label: 'Revenue', value: 'revenue'},
              {label: 'Year', value: 'year'}
            ]}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[2/3] bg-gray-900 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Film size={64} className="mb-4 opacity-20" />
          <p className="text-xl font-black uppercase tracking-widest">No Movies Found</p>
          <button onClick={() => {setFilters({industry: '', genre: '', sortBy: 'revenue', order: 'DESC'}); setSearch('');}} className="mt-4 text-red-500 font-bold hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
};

const FilterGroup = ({ label, value, onChange, options }) => (
  <div className="relative group">
    <select 
      value={typeof value === 'object' ? value.value : value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-[#0a0a0a] border border-gray-800 text-gray-400 px-6 py-3 pr-12 rounded-xl focus:outline-none focus:border-red-600 transition-all cursor-pointer font-bold text-xs uppercase tracking-widest"
    >
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-600 pointer-events-none group-hover:text-red-500 transition-colors" />
  </div>
);

const MovieCard = ({ movie }) => (
  <div className="group relative bg-[#0a0a0a] border border-gray-900 rounded-3xl overflow-hidden hover:border-red-600/30 transition-all duration-500 shadow-2xl hover:-translate-y-2">
    {/* Poster Section */}
    <div className="aspect-[2/3] relative overflow-hidden">
      <img 
        src={movie.posterUrl || `https://via.placeholder.com/300x450/111/555?text=${encodeURIComponent(movie.title)}`} 
        alt={movie.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
      
      {/* Industry Tag */}
      <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/10 text-white tracking-widest">
        {movie.industry}
      </span>
      
      {/* OTT Logo */}
      {movie.ottPlatform && (
        <span className="absolute top-4 right-4 bg-red-600 text-[10px] font-black uppercase px-2 py-1 rounded-md text-white shadow-lg shadow-red-600/40">
          {movie.ottPlatform}
        </span>
      )}

      {/* Hover Action */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
        <button className="bg-white text-black p-4 rounded-full shadow-2xl transform active:scale-90 transition-transform">
          <PlayCircle size={32} fill="currentColor" />
        </button>
      </div>
    </div>

    {/* Info Section */}
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-black leading-tight uppercase line-clamp-1 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        <span className="flex items-center gap-1 font-black text-amber-500">
          <Star size={14} fill="#f59e0b" />
          {movie.imdbRating}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-4">
        <span>{movie.year}</span>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        <span className="line-clamp-1 text-gray-400">{movie.genres ? movie.genres.join(', ') : ''}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Revenue</span>
          <span className="font-black text-sm text-green-500">${(movie.revenue / 1000000).toFixed(1)}M</span>
        </div>
        <button className="bg-[#111] hover:bg-gray-800 text-white p-2.5 rounded-xl transition-all border border-gray-800">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </div>
);

export default Movies;

