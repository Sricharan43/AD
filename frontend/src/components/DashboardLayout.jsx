import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Film, 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  UserCog, 
  LogOut, 
  BrainCircuit, 
  BarChart3, 
  Clapperboard,
  Search
} from 'lucide-react';

const DashboardLayout = ({ setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Recommendations', path: '/dashboard/recommendations', icon: <Clapperboard size={20} /> },
    { name: 'Actors', path: '/dashboard/actors', icon: <Users size={20} /> },
    { name: 'Directors', path: '/dashboard/directors', icon: <UserCog size={20} /> },
    { name: 'Box Office', path: '/dashboard/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Predictor', path: '/dashboard/ml-prediction', icon: <BrainCircuit size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hiddenSelection">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800/50 flex flex-col hidden md:flex">
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-amber-500 p-2 rounded-lg shadow-lg shadow-red-600/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            CINELYTICS
          </span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
            Main Menu
          </div>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-red-600/20 to-transparent border-l-4 border-red-600 text-white font-semibold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-red-400'} transition-colors`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-6 border-t border-gray-800/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#050505] overflow-y-auto relative custom-scrollbar">
        <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none"></div>
        <div className="p-8 lg:p-12 relative z-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

