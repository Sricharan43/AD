import React, { useState, useEffect } from 'react';
import { Award, Star, User } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const ActorRankings = () => {
  const [actors, setActors] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorRes, directorRes] = await Promise.all([
          axios.get(`${API_URL}/actors`),
          axios.get(`${API_URL}/actors/directors`)
        ]);
        setActors(actorRes.data);
        setDirectors(directorRes.data);
      } catch (err) {
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Actors Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Star className="text-yellow-500 fill-yellow-500" />
          Top 10 Performers (Actors)
        </h3>
        <div className="glass rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium">Actor</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Avg Revenue</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-center">Movies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(actors || []).slice(0, 10).map((actor, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{actor._id}</div>
                      <div className="text-xs text-slate-500">{actor.industries.join(', ')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-400">
                    ₹{actor.avgRevenue.toFixed(1)} Cr
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">{actor.movieCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Directors Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Award className="text-emerald-500" />
          Most Successful Directors
        </h3>
        <div className="glass rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium">Director</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Success Rate</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(directors || []).slice(0, 10).map((director, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      {idx + 1}
                    </div>
                    <div className="font-semibold">{director._id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex bg-slate-800 h-2 w-32 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-emerald-500 h-full" 
                        style={{ width: `${director.successRate * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">{(director.successRate * 100).toFixed(0)}% Hit rate</span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">{director.movieCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActorRankings;
