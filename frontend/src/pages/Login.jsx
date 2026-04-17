import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Film } from 'lucide-react';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5005/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      
      <Link to="/" className="flex items-center gap-2 text-primary font-bold text-3xl mb-8 z-10">
        <Film size={36} /> Cinelytics
      </Link>
      
      <div className="bg-gray-900 p-10 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl z-10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Email</label>
            <input 
              type="email" 
              className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-primary transition"
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-primary transition"
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-red-700 transition">
            Login
          </button>
        </form>
        
        <p className="mt-6 text-gray-400 text-center">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
