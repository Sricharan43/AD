import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, LabelList
} from 'recharts';
import { DollarSign, TrendingUp, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoxOfficeData();
  }, []);

  const fetchBoxOfficeData = async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/analytics/boxoffice');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Activity className="text-red-600 w-12 h-12 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight uppercase">Box Office Analytics</h1>
        <p className="text-gray-500 font-medium">Deep financial insights and industry performance ratios</p>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Scatter Plot: Budget vs Revenue */}
        <div className="bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight uppercase">Budget vs Revenue</h2>
            <TrendingUp className="text-red-600" size={24} />
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis type="number" dataKey="budget" name="Budget" unit="M" stroke="#666" fontSize={12} label={{ value: 'Budget (Millions)', position: 'insideBottom', offset: -10, fill: '#888' }} />
                <YAxis type="number" dataKey="revenue" name="Revenue" unit="M" stroke="#666" fontSize={12} label={{ value: 'Revenue (Millions)', angle: -90, position: 'insideLeft', fill: '#888' }} />
                <ZAxis type="category" dataKey="title" name="Movie" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Scatter data={data.scatterData} fill="#e50914" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Comparison */}
        <div className="bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight uppercase">Industry Financials</h2>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.industryComp}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="industry" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(val) => `${(val/1000000000).toFixed(1)}B`} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Total Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budget" fill="#1f2937" name="Total Budget" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hit vs Flop Ratio */}
        <div className="bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight uppercase">Market Success Ratio</h2>
            <PieIcon className="text-emerald-500" size={24} />
          </div>
          <div className="h-[350px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ratio}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.ratio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                  <LabelList dataKey="name" position="outside" stroke="#666" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex gap-8">
              <div className="text-center">
                <span className="block text-2xl font-black text-emerald-500">{data.ratio[0]?.value}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Hits</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-black text-red-500">{data.ratio[1]?.value}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Flops</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats / Summary Card */}
        <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-900/30 p-8 rounded-3xl shadow-2xl flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-blue-600/20 p-4 rounded-2xl w-fit">
              <DollarSign className="text-blue-400" size={32} />
            </div>
            <h2 className="text-3xl font-black uppercase">Financial Summary</h2>
            <p className="text-gray-400 font-medium max-w-sm">
              The industry shows a strong recovery trend with an overall profit margin of 24.5%. 
              Action and Sci-Fi genres remain the most capital-intensive but high-reward segments.
            </p>
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest">Efficiency Rate</span>
                <span className="text-xl font-black">78.2%</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest">Global Reach</span>
                <span className="text-xl font-black">142 Countries</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;

