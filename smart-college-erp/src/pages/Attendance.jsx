import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, Users, Calendar as CalendarIcon, 
  FileText, LogOut, Play, UserCheck, UserX, Clock, Plus, 
  ChevronLeft, ChevronRight, X, Sun, CheckCircle, XCircle 
} from 'lucide-react';

export default function Attendance() {
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [studentsList, setStudentsList] = useState([]);

  const fetchAttendance = async (date) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/${date}`);
      if (response.ok) {
        const data = await response.json();
        setStudentsList(data);
      }
    } catch (error) {
      console.error("Failed to fetch attendance", error);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const handleMarkAttendance = async (studentId, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          student_id: studentId, 
          date: selectedDate, 
          status: status 
        }),
      });

      if (response.ok) {
        setStudentsList(studentsList.map(student => 
          student.student_id === studentId ? { ...student, status: status } : student
        ));
      }
    } catch (error) {
      console.error("Failed to mark attendance", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="h-screen w-screen bg-rose-50 flex font-sans overflow-hidden">
      
      {/* 1. SIDEBAR - MASTER COMPONENT */}
      <div className="w-24 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col items-center py-8 justify-between h-full z-10">
        <Link to="/dashboard" className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 cursor-pointer hover:scale-105 transition-transform">
          <div className="grid grid-cols-2 gap-1 w-6 h-6">
             <div className="bg-white rounded-sm"></div>
             <div className="bg-white rounded-sm"></div>
             <div className="bg-white rounded-sm opacity-50"></div>
             <div className="bg-white rounded-sm"></div>
          </div>
        </Link>

        <div className="flex flex-col gap-8 text-gray-300">
          <Link to="/dashboard" className="relative flex justify-center group">
             <LayoutDashboard className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          <Link to="/attendance" className="relative flex justify-center group">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-rose-500 rounded-r-full"></div>
            <Activity className="w-7 h-7 text-rose-500 cursor-pointer" />
          </Link>

          <Link to="/students" className="relative flex justify-center group">
            <Users className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          <Link to="/calendar" className="relative flex justify-center group">
            <CalendarIcon className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          <Link to="/fees" className="relative flex justify-center group">
            <FileText className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>
        </div>

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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Attendance Tracker</h1>
                
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-50 flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-rose-400" />
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="outline-none text-gray-700 font-bold bg-transparent cursor-pointer"
                  />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-rose-50 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1 pr-4">
                  <div className="flex flex-col gap-4">
                    {studentsList.length === 0 ? (
                      <p className="text-gray-400 font-medium text-center mt-10">No students found. Add some in the Students tab first!</p>
                    ) : (
                      studentsList.map((student) => (
                        <div key={student.student_id} className="flex items-center justify-between p-4 bg-rose-50/30 rounded-2xl border border-rose-50 hover:bg-rose-50/80 transition-colors">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{student.name}</h4>
                            <p className="text-sm font-medium text-gray-400">ID: #{student.student_id}</p>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleMarkAttendance(student.student_id, 'present')}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all ${student.status === 'present' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-white text-gray-500 border border-gray-100 hover:border-emerald-200 hover:text-emerald-500'}`}
                            >
                              <CheckCircle className="w-4 h-4" /> Present
                            </button>
                            <button 
                              onClick={() => handleMarkAttendance(student.student_id, 'absent')}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all ${student.status === 'absent' ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'bg-white text-gray-500 border border-gray-100 hover:border-red-200 hover:text-red-500'}`}
                            >
                              <XCircle className="w-4 h-4" /> Absent
                            </button>
                            <button 
                              onClick={() => handleMarkAttendance(student.student_id, 'late')}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all ${student.status === 'late' ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-white text-gray-500 border border-gray-100 hover:border-amber-200 hover:text-amber-500'}`}
                            >
                              <Clock className="w-4 h-4" /> Late
                            </button>
                          </div>
                        </div>
                      ))
                    )}
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
        {import.meta.env.VITE_UNIVERSITY} 
    </p>
</footer>

      </div>
    </div>
  );
}
