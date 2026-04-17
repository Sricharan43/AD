import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Users, TrendingUp, Award, Award as Medal, Search, ChevronRight, Star } from 'lucide-react';

const Actors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/actors/top');
      setActors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredActors = actors.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top10 = actors.slice(0, 10);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Users className="text-red-600 w-12 h-12 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase text-white">Best Actors</h1>
          <p className="text-gray-500 font-medium">Top performers ranked by average box office revenue</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search actor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#111] border border-gray-800 text-white pl-12 pr-6 py-3 rounded-2xl focus:outline-none focus:border-red-600/50 w-full md:w-72 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight uppercase">Top 10 Revenue Generators</h2>
            <TrendingUp className="text-red-600" size={24} />
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" tick={{fontSize: 10}} angle={-20} textAnchor="end" />
                <YAxis stroke="#555" tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Bar dataKey="averageRevenue" fill="#e50914" radius={[6, 6, 0, 0]}>
                  {top10.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#e50914' : '#1f2937'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spotlight Card */}
        <div className="bg-gradient-to-br from-amber-600/20 to-transparent border border-amber-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Users size={200} />
          </div>
          <div className="relative z-10">
            <Award className="text-amber-500 mb-6" size={40} />
            <span className="bg-amber-500 text-[10px] font-black uppercase px-3 py-1 rounded-full text-white mb-4 inline-block">Star of the Industry</span>
            <h2 className="text-3xl font-black mb-2 uppercase text-white">{actors[0]?.name}</h2>
            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-medium">Avg Revenue</span>
                <span className="font-black text-emerald-500">${(actors[0]?.averageRevenue/1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-medium">Total Movies</span>
                <span className="font-black text-white">{actors[0]?.totalMovies}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-medium">Success Index</span>
                <span className="font-black text-amber-500">{actors[0]?.averageRating} ★</span>
              </div>
            </div>
            <button className="w-full mt-10 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              View Biography <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-gray-800/20 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight uppercase text-white">Actor Leaderboard</h3>
          <span className="text-xs font-bold text-gray-500 uppercase px-3 py-1 bg-gray-900 rounded-lg border border-gray-800">
            Active Roster: {filteredActors.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#050505] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Actor</th>
                <th className="px-8 py-5">Industry</th>
                <th className="px-8 py-5">Movies</th>
                <th className="px-8 py-5">Avg Rating</th>
                <th className="px-8 py-5">Avg Box Office</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/10">
              {filteredActors.map((actor, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                      idx < 3 ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-gray-900 text-gray-500'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-lg group-hover:text-red-500 transition-colors uppercase text-white">
                    {actor.name}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold px-3 py-1 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 uppercase tracking-tighter">
                      {actor.industry}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-medium text-gray-400">{actor.totalMovies}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 font-black text-amber-500">
                      <Star size={14} fill="#f59e0b" className="text-amber-500" />
                      {actor.averageRating}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-white">
                    ${(actor.averageRevenue / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-gray-600 hover:text-white transition-colors">
                      <ChevronRight />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Actors;

