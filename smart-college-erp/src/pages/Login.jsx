import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Calling your Node.js backend!
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the JWT token to the browser and redirect to the dashboard
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-rose-50 flex flex-col items-center justify-center font-sans overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      {/* Login Card */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/50 z-10">
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-200 mb-6">
            <div className="grid grid-cols-2 gap-1.5 w-8 h-8">
               <div className="bg-white rounded-[4px]"></div><div className="bg-white rounded-[4px]"></div>
               <div className="bg-white rounded-[4px] opacity-50"></div><div className="bg-white rounded-[4px]"></div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            EduFlow Pro <Play className="w-5 h-5 text-rose-500 fill-current" />
          </h1>
          <p className="text-gray-500 font-medium mt-2">Welcome back! Please login to your account.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm font-semibold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-rose-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all text-gray-700 font-medium shadow-sm"
            />
          </div>

          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-rose-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all text-gray-700 font-medium shadow-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 mt-2 transition-all flex items-center justify-center gap-2 hover:gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>
{/* --- PROFESSIONAL FOOTER --- */}
        <footer className="mt-auto pt-8 pb-4 text-center w-full">
    <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-${import.meta.env.VITE_THEME_COLOR}-200 to-transparent mb-4`}></div>
    <p className="text-sm font-semibold text-gray-400">
        <span className={`text-${import.meta.env.VITE_THEME_COLOR}-500 font-bold`}>{import.meta.env.VITE_APP_NAME}</span> — Designed & Developed by 
        <span className="text-gray-600 font-extrabold ml-1">{import.meta.env.VITE_DEVELOPER}</span>
    </p>
    <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em] mt-1">
        {import.meta.env.VITE_UNIVERSITY} 
    </p>
</footer>
      </div>
    </div>
  );
}
