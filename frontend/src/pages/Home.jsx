import React from 'react';
import { Link } from 'react-router-dom';
import { Film, TrendingUp, BarChart3, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-dark text-white font-sans">
      <nav className="p-6 flex justify-between items-center border-b border-gray-800 bg-black/50 backdrop-blur-md fixed w-full z-10">
        <div className="text-2xl font-bold text-primary flex items-center gap-2">
          <Film className="w-8 h-8" /> Cinelytics
        </div>
        <div className="flex gap-6 text-lg">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/login" className="hover:text-primary transition">Login</Link>
          <Link to="/register" className="bg-primary px-4 py-1 rounded hover:bg-red-700 transition">Register</Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center min-h-[70vh] justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to bottom, black, transparent)'
          }}></div>
          
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Discover Indian Cinema <br/><span className="text-primary">through Data</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10">
              Analytics, ML Box Office Predictions, and Data-Driven Movie Insights.
            </p>
            <Link to="/login" className="px-8 py-4 bg-primary text-white font-bold rounded-lg text-xl hover:bg-red-700 transition transform hover:scale-105 inline-block shadow-[0_0_15px_rgba(229,9,20,0.5)]">
              Get Started
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#0a0a0a]">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Star />} title="Movie Recommendations" desc="Find movies tailored to your taste by rating, genre, and actors." />
            <FeatureCard icon={<TrendingUp />} title="Actor & Director Rankings" desc="Data-driven rankings based on box office revenue and ratings." />
            <FeatureCard icon={<BarChart3 />} title="Box Office Analytics" desc="Detailed charts breaking down profitability by year and genre." />
            <FeatureCard icon={<Film />} title="ML Success Prediction" desc="Predict a movie's financial success before it releases using Random Forest models." />
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-500">
        <p>&copy; 2026 Cinelytics. Developed for Movie Analytics.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-xl bg-gray-900 border border-gray-800 hover:border-primary transition group hover:-translate-y-2 duration-300">
    <div className="text-primary w-12 h-12 mb-6 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
