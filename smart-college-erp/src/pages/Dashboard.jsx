import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Activity, Users, Calendar as CalendarIcon, 
  FileText, LogOut, Play, UserCheck, UserX, Clock, Plus, 
  ChevronLeft, ChevronRight, X, Sun 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // 1. Database Stats State
  const [stats, setStats] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  // 2. Clock & Date State
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 3. Dynamic Calendar State
  const [viewDate, setViewDate] = useState(new Date());

  // 4. Interactive Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Tomorrow Holiday", text: "College will remain closed for the local festival. Office will reopen on Monday." }
  ]);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();
    return () => clearInterval(timerId);
  }, []);

  // --- Date Formatting Logic ---
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const dayNumber = currentTime.getDate();
  const monthName = currentTime.toLocaleDateString('en-US', { month: 'long' });
  const viewMonthName = viewDate.toLocaleDateString('en-US', { month: 'long' });
  const year = currentTime.getFullYear();
  const viewYear = viewDate.getFullYear();
  
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
  };
  const formattedDate = `${dayNumber}${getOrdinalSuffix(dayNumber)} ${monthName}`;

  // --- Interactive Functions ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const addNotification = () => {
    const title = prompt("Enter Notification Title:");
    const text = prompt("Enter Notification Detail:");
    if (title && text) {
      setNotifications([{ id: Date.now(), title, text }, ...notifications]);
    }
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // --- Dynamic Calendar Generator ---
  const renderCalendarDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(viewYear, viewDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(viewYear, viewDate.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewDate.getMonth(), 0).getDate();

    // Fill previous month grey days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(<div key={`prev-${i}`} className="text-gray-300 text-sm font-bold flex items-center justify-center h-8">{prevMonthDays - i}</div>);
    }

    // Fill current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === new Date().getDate() && viewDate.getMonth() === new Date().getMonth() && viewYear === new Date().getFullYear();
      days.push(
        <div key={`curr-${d}`} className={`text-sm font-bold flex items-center justify-center h-8 ${isToday ? 'text-white bg-rose-500 rounded-full w-8 mx-auto shadow-md shadow-rose-200' : 'text-gray-800'}`}>
          {d < 10 ? `0${d}` : d}
        </div>
      );
    }
    return days;
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewYear, viewDate.getMonth() + offset, 1));
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

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto h-full">
        
        <div className="flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white rounded-[2rem] p-4 px-8 shadow-sm flex justify-between items-center border border-rose-50">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Dashboard</h1>
                <Play className="w-5 h-5 text-rose-500 fill-current" />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-[15px]">Admin</p>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">admin@eduflow.ac.in</p>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-rose-100">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Stats Grid - All 4 Cards Restored */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
  
  {/* Total Students */}
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-50 flex flex-col justify-center relative group hover:shadow-md transition-shadow">
    <Users className="w-6 h-6 text-rose-400 absolute top-6 right-6" />
    <h3 className="text-4xl font-extrabold text-gray-800">{stats.totalStudents}</h3>
    <p className="text-sm font-bold text-gray-600 mt-2">Total Students</p>
  </div>

  {/* Present Today */}
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-50 flex flex-col justify-center relative group hover:shadow-md transition-shadow">
    <UserCheck className="w-6 h-6 text-emerald-400 absolute top-6 right-6" />
    <h3 className="text-4xl font-extrabold text-gray-800">{stats.present}</h3>
    <p className="text-sm font-bold text-gray-600 mt-2">Present Today</p>
  </div>

  {/* Absent Today */}
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-50 flex flex-col justify-center relative group hover:shadow-md transition-shadow">
    <UserX className="w-6 h-6 text-rose-500 absolute top-6 right-6" />
    <h3 className="text-4xl font-extrabold text-gray-800">{stats.absent}</h3>
    <p className="text-sm font-bold text-gray-600 mt-2">Absent Today</p>
  </div>

  {/* Late Arrivals */}
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-50 flex flex-col justify-center relative group hover:shadow-md transition-shadow">
    <Clock className="w-6 h-6 text-amber-400 absolute top-6 right-6" />
    <h3 className="text-4xl font-extrabold text-gray-800">{stats.late}</h3>
    <p className="text-sm font-bold text-gray-600 mt-2">Late Arrivals</p>
  </div>
</div>

            {/* Notifications & Calendar Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Interactive Notifications */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-rose-50 relative flex flex-col overflow-hidden">
                <h3 className="text-xl font-extrabold text-gray-800 mb-6">Notifications & Reminders</h3>
                <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                  {notifications.map(note => (
                    <div key={note.id} className="bg-rose-50/70 rounded-2xl p-6 border border-rose-100 group relative">
                      <button onClick={() => deleteNotification(note.id)} className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-bold text-gray-800 text-lg">{note.title}</h4>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed font-medium">{note.text}</p>
                    </div>
                  ))}
                </div>
                <button onClick={addNotification} className="absolute bottom-8 right-8 w-14 h-14 bg-rose-400 hover:bg-rose-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110">
                  <Plus className="w-7 h-7" />
                </button>
              </div>

              {/* Dynamic Calendar */}
              <div className="lg:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-rose-50 flex flex-col">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800">Calendar</h3>
                    <p className="text-sm font-bold text-gray-500 mt-1">{viewMonthName} {viewYear}</p>
                  </div>
                  <div className="flex gap-2 mb-1">
                    <ChevronLeft onClick={() => changeMonth(-1)} className="w-5 h-5 text-gray-400 cursor-pointer hover:text-rose-500" />
                    <ChevronRight onClick={() => changeMonth(1)} className="w-5 h-5 text-gray-800 cursor-pointer hover:text-rose-500" />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-4 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{day}</div>
                  ))}
                  {renderCalendarDays()}
                </div>
              </div>

            </div>
        </div>

        <footer className="mt-auto pt-8 pb-4 text-center w-full">
    <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-${import.meta.env.VITE_THEME_COLOR}-200 to-transparent mb-4`}></div>
    <p className="text-sm font-semibold text-gray-400">
        <span className={`text-${import.meta.env.VITE_THEME_COLOR}-500 font-bold`}>{import.meta.env.VITE_APP_NAME}</span> — Designed & Developed by 
        <span className="text-gray-600 font-extrabold ml-1">{import.meta.env.VITE_DEVELOPER}</span>
    </p>
    <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em] mt-1">
        {import.meta.env.VITE_UNIVERSITY} • MCA 2027
    </p>
</footer>

      </div>
    </div>
  );
}