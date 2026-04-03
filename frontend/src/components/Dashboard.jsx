import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, Film, Users, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics/dashboard`);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Movies', value: data.totalMovies, icon: Film, color: 'text-blue-500' },
          { label: 'Industries', value: data.industriesCount, icon: Users, color: 'text-emerald-500' },
          { label: 'Avg Revenue', value: '₹' + (data?.avgRevenueByIndustry?.[0]?.avgRevenue || 0).toFixed(1) + 'cr', icon: IndianRupee, color: 'text-amber-500' },
          { label: 'Growth rate', value: '+12.5%', icon: TrendingUp, color: 'text-purple-500' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass p-6 rounded-2xl flex items-center justify-between card-hover">
              <div>
                <p className="text-slate-400 text-sm font-medium">{kpi.label}</p>
                <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-slate-800 border border-slate-700 ${kpi.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Revenue by Industry */}
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BarChart size={20} className="text-blue-500" />
            Average Revenue by Industry
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.avgRevenueByIndustry || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="avgRevenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Revenue */}
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Budget vs Revenue (Top Hits)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.budgetVsRevenue || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="title" stroke="#94a3b8" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="budget" stroke="#3b82f6" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
