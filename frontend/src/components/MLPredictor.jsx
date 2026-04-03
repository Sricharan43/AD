import React, { useState } from 'react';
import { BrainCircuit, TrendingUp, Sparkles, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ML_URL } from '../config';

const MLPredictor = () => {
    const [formData, setFormData] = useState({
        genre: 'Action',
        industry: 'Bollywood',
        budget: 50,
        cast_popularity: 7.5,
        director_track_record: 0.8,
        release_year: 2025
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const genres = ["Action", "Drama", "Romance", "Comedy", "Thriller", "Horror", "Sci-Fi", "Fantasy", "Crime", "Family", "Biography", "Sports", "Historical"];
    const industries = ["Bollywood", "Tollywood", "Kollywood", "Mollywood", "Sandalwood"];

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${ML_URL}/predict`, formData);
            setResult(response.data);
        } catch (err) {
            console.error('Prediction failed:', err);
            setError(err.response?.data?.detail || err.message || "Connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Prediction Form */}
                <div className="glass p-8 rounded-3xl border border-blue-500/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BrainCircuit size={100} />
                    </div>
                    <form onSubmit={handlePredict} className="space-y-6 relative z-10">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Sparkles className="text-blue-500" />
                            Input Parameters
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Industry</label>
                                <select 
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                >
                                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Primary Genre</label>
                                <select 
                                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    value={formData.genre}
                                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                                >
                                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-400">Budget (₹{formData.budget} Cr)</label>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="500" 
                                className="w-full accent-blue-500"
                                value={formData.budget}
                                onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-400">Star Popularity ({formData.cast_popularity}/10)</label>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="10" step="0.1" 
                                className="w-full accent-emerald-500"
                                value={formData.cast_popularity}
                                onChange={(e) => setFormData({...formData, cast_popularity: parseFloat(e.target.value)})}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-400">Director Track Record ({(formData.director_track_record * 100).toFixed(0)}%)</label>
                            </div>
                            <input 
                                type="range" 
                                min="0.1" max="1.0" step="0.01" 
                                className="w-full accent-purple-500"
                                value={formData.director_track_record}
                                onChange={(e) => setFormData({...formData, director_track_record: parseFloat(e.target.value)})}
                            />
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} />}
                            Predict Performance
                        </button>
                    </form>
                </div>

                {/* Prediction Result */}
                <div className="flex flex-col justify-center gap-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-red-500 text-center animate-shake">
                            <p className="font-bold mb-2">Analysis Failed</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    )}
                    {!result ? (
                        <div className="glass p-12 rounded-3xl border border-slate-800 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                                <BrainCircuit size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-500">Awaiting Analysis</h4>
                            <p className="text-slate-600">Adjust the inputs and trigger the AI model to see predicted box office performance.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className={`p-1 hidden h-64 rounded-3xl animate-pulse`}></div>
                            <div className={`
                                p-12 rounded-3xl glass border-2 text-center space-y-6 relative overflow-hidden
                                ${result.prediction === 'Hit' ? 'border-emerald-500/50 bg-emerald-500/5' : 
                                  result.prediction === 'Average' ? 'border-amber-500/50 bg-amber-500/5' : 
                                  'border-red-500/50 bg-red-500/5'}
                            `}>
                                <div className="absolute -top-10 -left-10 opacity-10">
                                    <Sparkles size={200} />
                                </div>
                                <h5 className="text-slate-400 font-medium">Prediction Result</h5>
                                <h2 className={`
                                    text-7xl font-black italic tracking-tighter
                                    ${result.prediction === 'Hit' ? 'text-emerald-500' : 
                                      result.prediction === 'Average' ? 'text-amber-500' : 
                                      'text-red-500'}
                                `}>
                                    {result.prediction.toUpperCase()}
                                </h2>
                                <div className="flex items-center justify-center gap-2 text-slate-300">
                                    <span>Confidence Score:</span>
                                    <span className="font-bold">{(result.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="pt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-4 rounded-2xl">
                                        <p className="text-xs text-slate-500">Market Risk</p>
                                        <p className="text-lg font-bold">Low</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-2xl">
                                        <p className="text-xs text-slate-500">Target Audience</p>
                                        <p className="text-lg font-bold">Mass</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MLPredictor;
