import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { 
  Film, Users, Star, DollarSign, Filter, ChevronDown, 
  TrendingUp, Activity, PieChart as PieIcon
} from 'lucide-react';

const COLORS = ['#e50914', '#007aff', '#ffcc00', '#4cd964', '#5856d6', '#ff2d55'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ industry: '', year: '', genre: '' });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/analytics/dashboard');
      setData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
        </div>
      </div>
    );
  }

  const { summary, charts } = data;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">DASHBOARD</h1>
          <p className="text-gray-500 font-medium">Real-time industry insights and performance metrics</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <select 
              className="appearance-none bg-[#111] border border-gray-800 text-gray-300 px-5 py-2.5 pr-10 rounded-xl focus:outline-none focus:border-red-600 transition-all cursor-pointer font-medium"
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
            >
              <option value="">All Industries</option>
              <option value="Bollywood">Bollywood</option>
              <option value="Tollywood">Tollywood</option>
              <option value="Kollywood">Kollywood</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-red-500 transition-colors" />
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-red-600/20">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Movies', value: summary.totalMovies, icon: <Film />, color: 'from-red-600 to-red-900', suffix: '' },
          { label: 'Total Talent', value: summary.totalTalent, icon: <Users />, color: 'from-blue-600 to-blue-900', suffix: '' },
          { label: 'Avg Rating', value: summary.avgRating, icon: <Star />, color: 'from-amber-500 to-amber-800', suffix: '/10' },
          { label: 'Total Revenue', value: (summary.totalRevenue / 1000000000).toFixed(1), icon: <DollarSign />, color: 'from-emerald-600 to-emerald-900', suffix: 'B' },
        ].map((item, idx) => (
          <div key={idx} className="bg-[#0a0a0a] border border-gray-800/50 p-6 rounded-2xl relative overflow-hidden group hover:border-red-600/30 transition-all duration-500 shadow-xl shadow-black">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.label}</span>
                <span className="text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
              </div>
              <div className="text-3xl font-black tracking-tight">
                {item.value}<span className="text-sm font-medium text-gray-500 ml-1">{item.suffix}</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-800/50 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budget vs Revenue */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black tracking-tight">BUDGET VS REVENUE</h2>
              <p className="text-gray-500 text-sm font-medium">Top 20 Performing Movies</p>
            </div>
            <Activity className="text-red-600" size={24} />
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.budgetVsRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="title" angle={-45} textAnchor="end" interval={0} stroke="#444" tick={{fill: '#666', fontSize: 10}} />
                <YAxis stroke="#444" tick={{fill: '#666', fontSize: 12}} tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', padding: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="revenue" fill="#e50914" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="budget" fill="#1f2937" radius={[4, 4, 0, 0]} name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Share */}
        <div className="bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight">INDUSTRY SHARE</h2>
            <PieIcon className="text-blue-500" size={24} />
          </div>
          <div className="flex-1 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.industryShare}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {charts.industryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800/50 grid grid-cols-2 gap-4">
            <div className="text-center">
              <span className="block text-gray-500 text-[10px] font-bold uppercase">Primary Source</span>
              <span className="text-lg font-black">{charts.industryShare[0]?.name || '-'}</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 text-[10px] font-bold uppercase">Growth Trend</span>
              <span className="text-lg font-black text-green-500">+12.4%</span>
            </div>
          </div>
        </div>

        {/* Hit Trend */}
        <div className="lg:col-span-1 bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight">YEAR-WISE HITS</h2>
            <TrendingUp className="text-emerald-500" size={24} />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.hitTrend}>
                <defs>
                  <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Profitability */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight">GENRE PROFITABILITY</h2>
            <Film className="text-amber-500" size={24} />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.genreProfitability} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#666" fontSize={12} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                <Bar dataKey="avgRevenue" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
