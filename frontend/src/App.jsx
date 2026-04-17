import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Movies from './pages/dashboard/Movies';
import Analytics from './pages/dashboard/Analytics';
import MLPrediction from './pages/dashboard/MLPrediction';
import Actors from './pages/dashboard/Actors';
import Directors from './pages/dashboard/Directors';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        {token ? (
          <Route path="/dashboard" element={<DashboardLayout setToken={setToken} />}>
            <Route index element={<Dashboard />} />
            <Route path="recommendations" element={<Movies />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ml-prediction" element={<MLPrediction />} />
            <Route path="actors" element={<Actors />} />
            <Route path="directors" element={<Directors />} />
          </Route>
        ) : (
          <Route path="/dashboard/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

