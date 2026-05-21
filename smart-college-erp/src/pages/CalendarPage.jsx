import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Check these imports carefully!
import { 
  LayoutDashboard, Activity, Users, Calendar as CalendarIcon, 
  FileText, LogOut, Play, UserCheck, UserX, Clock, Plus, 
  ChevronLeft, ChevronRight, X, Sun 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(new Date());
  
  // Sample events to show it's working
  const [events, setEvents] = useState([
    { date: '2026-02-28', title: 'ERP Submission' },
    { date: '2026-03-05', title: 'Final Viva Exam' }
  ]);

  const viewMonth = viewDate.getMonth();
  const viewYear = viewDate.getFullYear();
  const monthName = viewDate.toLocaleString('en-US', { month: 'long' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewYear, viewMonth + offset, 1));
  };

  const renderDays = () => {
    const days = [];
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-rose-50 bg-gray-50/20"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = d === new Date().getDate() && viewMonth === new Date().getMonth();

      days.push(
        <div 
          key={d} 
          onClick={() => {
            const title = prompt("Enter Event Name:");
            if(title) setEvents([...events, { date: dateStr, title }]);
          }}
          className="h-24 border border-rose-50 p-2 hover:bg-rose-50 transition-colors cursor-pointer group"
        >
          <span className={`text-sm font-bold ${isToday ? 'bg-rose-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md' : 'text-gray-400'}`}>
            {d}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.map((e, i) => (
              <div key={i} className="text-[10px] bg-rose-100 text-rose-600 p-1 rounded font-bold truncate">
                {e.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="h-screen w-screen bg-rose-50 flex font-sans overflow-hidden">
     {/* 1. SIDEBAR - MASTER COMPONENT */}
<div className="w-24 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col items-center py-8 justify-between h-full z-10">
  
  {/* TOP: Logo Icon (Now functional - redirects to Dashboard) */}
  <Link to="/dashboard" className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 cursor-pointer hover:scale-105 transition-transform">
    <div className="grid grid-cols-2 gap-1 w-6 h-6">
       <div className="bg-white rounded-sm"></div>
       <div className="bg-white rounded-sm"></div>
       <div className="bg-white rounded-sm opacity-50"></div>
       <div className="bg-white rounded-sm"></div>
    </div>
  </Link>

  {/* MIDDLE: Navigation Links */}
  <div className="flex flex-col gap-8 text-gray-300">
    {/* Dashboard */}
    <Link to="/dashboard" className="relative flex justify-center group">
       <LayoutDashboard className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
    </Link>

    {/* Attendance */}
    <Link to="/attendance" className="relative flex justify-center group">
      <Activity className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
    </Link>

    {/* Students */}
    <Link to="/students" className="relative flex justify-center group">
      <Users className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
    </Link>

    {/* Calendar */}
    <Link to="/calendar" className="relative flex justify-center group">
      <CalendarIcon className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
    </Link>

    {/* Fees */}
    <Link to="/fees" className="relative flex justify-center group">
      <FileText className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
    </Link>
  </div>

  {/* BOTTOM: Logout */}
  <div>
    <LogOut 
      onClick={handleLogout} 
      className="w-7 h-7 text-gray-300 hover:text-rose-500 cursor-pointer transition-colors" 
    />
  </div>
</div>
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col p-8 gap-6 h-full overflow-hidden">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-rose-50">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">{monthName} {viewYear}</h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">EduFlow Academic Planner</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => changeMonth(-1)} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors"><ChevronLeft /></button>
            <button onClick={() => changeMonth(1)} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors"><ChevronRight /></button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-rose-50 flex-1 flex flex-col p-6 overflow-hidden">
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-black text-gray-300 uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1 border-t border-l border-rose-50 rounded-xl overflow-y-auto">
            {renderDays()}
          </div>
        </div>
        
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