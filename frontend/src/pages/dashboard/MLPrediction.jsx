import React, { useState } from 'react';
import axios from 'axios';
import { 
  BrainCircuit, Sparkles, DollarSign, TrendingUp, AlertCircle, 
  ChevronRight, Activity, Percent, ThumbsUp, ThumbsDown, Info
} from 'lucide-react';

const MLPrediction = () => {
  const [formData, setFormData] = useState({
    budget: 50000000,
    industry: 'Bollywood',
    genre_count: 2,
    actor_count: 3,
    genre: '',
    actor: '',
    director: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/predict', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight uppercase text-white">Success Predictor</h1>
        <p className="text-gray-500 font-medium tracking-wide text-white">AI-powered box office performance forecasting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Prediction Form */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-600/20 p-2 rounded-lg">
              <BrainCircuit className="text-red-500" size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase text-white">Parameters</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Budget (USD)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="number" 
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                  className="w-full bg-black border border-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600/50 transition-all font-bold text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Industry</label>
                <select 
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full bg-black border border-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:border-red-600/50 transition-all font-bold text-white appearance-none"
                >
                  <option value="Bollywood">Bollywood</option>
                  <option value="Tollywood">Tollywood</option>
                  <option value="Kollywood">Kollywood</option>
                  <option value="Mollywood">Mollywood</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Primary Genre</label>
                <select 
                   className="w-full bg-black border border-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:border-red-600/50 transition-all font-bold text-white appearance-none"
                >
                  <option value="Action">Action</option>
                  <option value="Drama">Drama</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Comedy">Comedy</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center bg-gray-900/40 p-4 rounded-2xl border border-gray-800/50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cast Power</span>
                  <span className="text-white font-bold">{formData.actor_count} Main Actors</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={formData.actor_count}
                  onChange={(e) => setFormData({...formData, actor_count: Number(e.target.value)})}
                  className="accent-red-600 cursor-pointer"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                loading ? 'bg-gray-800 cursor-not-allowed text-gray-500' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
              }`}
            >
              {loading ? <Activity className="animate-spin text-white" /> : <Sparkles size={20} className="text-white" />}
              <span className="text-white">{loading ? 'Processing Analysis...' : 'Generate Prediction'}</span>
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-3 space-y-8">
          {result ? (
            <div className="animate-in slide-in-from-right duration-700">
              <div className={`p-10 rounded-[2.5rem] border relative overflow-hidden shadow-2xl ${
                result.prediction.includes('Hit') 
                  ? 'bg-gradient-to-br from-emerald-600/20 to-transparent border-emerald-900/30' 
                  : 'bg-gradient-to-br from-red-600/20 to-transparent border-red-900/30'
              }`}>
                <div className="absolute right-[-40px] top-[-40px] opacity-10 blur-3xl w-64 h-64 bg-white rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-2 block">AI Probabilistic Forecast</span>
                      <h3 className={`text-5xl font-black uppercase ${
                        result.prediction.includes('Hit') ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {result.prediction}
                      </h3>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 text-center px-10">
                        <span className="block text-[10px] font-black text-gray-500 uppercase mb-1">Confidence</span>
                        <div className="flex items-center gap-2">
                           <span className="text-3xl font-black text-white">{result.confidence}%</span>
                           <Percent size={18} className="text-red-500" />
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                      <TrendingUp className="text-gray-500 mb-4" size={20} />
                      <span className="block text-[10px] font-black text-gray-500 uppercase mb-1">Estimated Revenue</span>
                      <span className="text-xl font-black text-white">${(result.predicted_revenue/1000000).toFixed(1)}M</span>
                    </div>
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                      {result.ratio > 1 ? <ThumbsUp className="text-emerald-500 mb-4" size={20} /> : <ThumbsDown className="text-red-500 mb-4" size={20} />}
                      <span className="block text-[10px] font-black text-gray-500 uppercase mb-1">B-E Ratio</span>
                      <span className="text-xl font-black text-white">{result.ratio}x</span>
                    </div>
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                      <AlertCircle className="text-gray-500 mb-4" size={20} />
                      <span className="block text-[10px] font-black text-gray-500 uppercase mb-1">Risk Factor</span>
                      <span className="text-xl font-black text-white">{result.ratio > 1.5 ? 'LOW' : result.ratio > 1 ? 'MED' : 'HIGH'}</span>
                    </div>
                  </div>

                  <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <Info size={16} className="text-red-500" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Analysis Summary</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "Given the budget of ${(formData.budget/1000000).toFixed(0)}M in the {formData.industry} industry, 
                      the model identifies significant competitive advantages based on historical trends of similar genre-actor compositions. 
                      Market saturation for this period remains optimal."
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between px-6">
                <span className="text-sm font-bold text-gray-500">Neural Engine v4.2.0 • Data Latency: 42ms</span>
                <button className="text-red-500 text-sm font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                  Detailed Roadmap <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-800 rounded-[3rem] opacity-50">
              <BrainCircuit size={80} className="text-gray-700 mb-6" />
              <h3 className="text-2xl font-black text-gray-600 uppercase mb-2">Awaiting Parameters</h3>
              <p className="text-gray-500 max-w-xs mx-auto text-white">
                Select your movie dimensions and click generate to see the AI analysis.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MLPrediction;

