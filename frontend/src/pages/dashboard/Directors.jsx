import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { UserCog, TrendingUp, Award, Award as Medal, Search, ChevronRight } from 'lucide-react';

const Directors = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/directors/top');
      setDirectors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDirectors = directors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top10 = directors.slice(0, 10);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <UserCog className="text-red-600 w-12 h-12 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">Best Directors</h1>
          <p className="text-gray-500 font-medium">Industry leaders ranked by box office performance</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search director..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#111] border border-gray-800 text-white pl-12 pr-6 py-3 rounded-2xl focus:outline-none focus:border-red-600/50 w-full md:w-72 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Summary */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight uppercase">Top 10 Success Rate</h2>
            <Medal className="text-amber-500" size={24} />
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

        {/* Top Talent Spotlight */}
        <div className="bg-gradient-to-br from-red-600/20 to-transparent border border-red-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <UserCog size={200} />
          </div>
          <div className="relative z-10">
            <Award className="text-red-600 mb-6" size={40} />
            <span className="bg-red-600 text-[10px] font-black uppercase px-3 py-1 rounded-full text-white mb-4 inline-block">Director of the Month</span>
            <h2 className="text-3xl font-black mb-2 uppercase">{directors[0]?.name}</h2>
            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-medium">Avg Revenue</span>
                <span className="font-black text-red-500">${(directors[0]?.averageRevenue/1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-medium">Total Movies</span>
                <span className="font-black text-white">{directors[0]?.totalMovies}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-medium">Avg Rating</span>
                <span className="font-black text-amber-500">{directors[0]?.averageRating} ★</span>
              </div>
            </div>
            <button className="w-full mt-10 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              View Portfolio <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Directors Table */}
      <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-gray-800/20 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight uppercase">Leaderboard</h3>
          <span className="text-xs font-bold text-gray-500 uppercase px-3 py-1 bg-gray-900 rounded-lg border border-gray-800">
            Showing {filteredDirectors.length} Directors
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#050505] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Director Name</th>
                <th className="px-8 py-5">Industry</th>
                <th className="px-8 py-5">Movies</th>
                <th className="px-8 py-5">Avg Rating</th>
                <th className="px-8 py-5">Avg Revenue</th>
                <th className="px-8 py-5">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/10">
              {filteredDirectors.map((director, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                      idx < 3 ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-gray-900 text-gray-500'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-lg group-hover:text-red-500 transition-colors uppercase">
                    {director.name}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 uppercase tracking-tighter">
                      {director.industry}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-medium text-gray-400">{director.totalMovies}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 font-black text-amber-500">
                      <Star size={14} fill="#f59e0b" />
                      {director.averageRating}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-white">
                    ${(director.averageRevenue / 1000000).toFixed(1)}M
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

// Simple Star Icon
const Star = ({ size, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default Directors;
