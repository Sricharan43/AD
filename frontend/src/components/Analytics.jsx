import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, TrendingUp, Cpu, Monitor, PlayCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const Analytics = () => {
    const [genreData, setGenreData] = useState([]);
    const [yearlyTrends, setYearlyTrends] = useState([]);
    const [ottData, setOttData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [genreRes, yearlyRes, ottRes] = await Promise.all([
                    axios.get(`${API_URL}/analytics/genre-revenue`),
                    axios.get(`${API_URL}/analytics/yearly-trends`),
                    axios.get(`${API_URL}/analytics/ott-vs-theatre`)
                ]);
                setGenreData(genreRes.data);
                setYearlyTrends(yearlyRes.data);
                setOttData(ottRes.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading...</div>;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899'];

    return (
        <div className="space-y-10 pb-20">
            {/* Genre vs Revenue */}
            <div className="glass p-8 rounded-3xl border border-slate-800">
                <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <BarChart3 className="text-blue-500" />
                    Genre Performance vs Market Revenue
                </h4>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={genreData || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="_id" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                            />
                            <Bar 
                                dataKey="averageRevenue" 
                                name="Avg Revenue (Cr)" 
                                fill="#3b82f6" 
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Yearly Trends */}
                <div className="glass p-8 rounded-3xl border border-slate-800">
                    <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <TrendingUp className="text-emerald-500" />
                        Industry Growth (Year-wise)
                    </h4>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={yearlyTrends || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="_id" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    name="Movies Released" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#3b82f6' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="hitCount" 
                                    name="Hits" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* OTT Performance */}
                <div className="glass p-8 rounded-3xl border border-slate-800">
                    <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <Monitor className="text-purple-500" />
                        Platform Performance Matrix
                    </h4>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" dataKey="avgRating" name="Rating" unit="" stroke="#94a3b8" domain={[0, 10]} />
                                <YAxis type="number" dataKey="avgRevenue" name="Revenue" unit="Cr" stroke="#94a3b8" />
                                <ZAxis type="category" dataKey="_id" name="Platform" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                <Scatter name="Platforms" data={ottData || []} fill="#8b5cf6">
                                    {(ottData || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6">
                        {ottData.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                <span className="text-slate-400">{entry._id}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
