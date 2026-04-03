import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Film, 
  BrainCircuit, 
  BarChart3, 
  Search,
  Menu,
  X,
  TrendingUp,
  Award,
  Video,
  Clapperboard
} from 'lucide-react';
import axios from 'axios';

// Component imports (will be created next)
import Dashboard from './components/Dashboard';
import ActorRankings from './components/ActorRankings';
import MovieSearch from './components/MovieSearch';
import MLPredictor from './components/MLPredictor';
import Analytics from './components/Analytics';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rankings', label: 'Best Actors & Directors', icon: Users },
    { id: 'movies', label: 'Movie Recommendations', icon: Film },
    { id: 'predictor', label: 'Box Office Predictor', icon: BrainCircuit },
    { id: 'analytics', label: 'Analytics Section', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white flex">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-50
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Clapperboard className="w-8 h-8 text-blue-500" />
          <h1 className={`text-xl font-bold tracking-tight ${!isSidebarOpen && 'hidden'}`}>Cinelytics</h1>
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                  ${activeTab === tab.id ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-slate-400 hover:bg-slate-800'}
                `}
              >
                <Icon size={20} />
                <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex justify-center p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
        <header className="p-8 pb-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-400 mt-1">Deep analytics into the Indian Film Industry</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
                <Search size={20} className="text-slate-400" />
              </div>
              <div className="bg-blue-600 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                <TrendingUp size={16} />
                Live Trends
              </div>
            </div>
          </div>
        </header>

        <section className="p-8 pt-4 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'rankings' && <ActorRankings />}
          {activeTab === 'movies' && <MovieSearch />}
          {activeTab === 'predictor' && <MLPredictor />}
          {activeTab === 'analytics' && <Analytics />}
        </section>
      </main>
    </div>
  );
};

export default App;
