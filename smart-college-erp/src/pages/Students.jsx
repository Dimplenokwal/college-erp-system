import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, Users, Calendar as CalendarIcon, 
  FileText, LogOut, Plus, User as UserIcon, Mail 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch students when the page loads
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle adding a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Student added successfully!'); 
        setName('');
        setEmail('');
        fetchStudents(); // Refresh the table instantly
      } else {
        toast.error(data.message || 'Failed to add student'); 
      }
    } catch (error) {
      toast.error('Failed to connect to server.');
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
        
        {/* TOP: Logo Icon */}
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
          <Link to="/dashboard" className="relative flex justify-center group">
             <LayoutDashboard className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          <Link to="/attendance" className="relative flex justify-center group">
            <Activity className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          {/* Students (ACTIVE PAGE) */}
          <Link to="/students" className="relative flex justify-center group">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-rose-500 rounded-r-full"></div>
            <Users className="w-7 h-7 text-rose-500 cursor-pointer" />
          </Link>

          <Link to="/calendar" className="relative flex justify-center group">
            <CalendarIcon className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

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
      <div className="flex-1 flex flex-col p-8 gap-6 h-full overflow-y-auto">
        
        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Student Management</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            
            {/* Add Student Form */}
            <div className="lg:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-rose-50 h-fit">
              <h3 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-500" /> Add New Student
              </h3>

              <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-rose-50/50 rounded-xl py-3 pl-12 pr-4 outline-none border border-rose-100 focus:border-rose-400 text-gray-700 font-medium" />
                </div>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-rose-50/50 rounded-xl py-3 pl-12 pr-4 outline-none border border-rose-100 focus:border-rose-400 text-gray-700 font-medium" />
                </div>
                <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition-all mt-2">
                  Save Student
                </button>
              </form>
            </div>

            {/* Students Data Table */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-rose-50 overflow-hidden flex flex-col min-h-[400px]">
              <h3 className="text-xl font-extrabold text-gray-800 mb-6">Registered Students</h3>
              <div className="overflow-auto flex-1 pr-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-rose-100 text-gray-400">
                      <th className="pb-3 font-bold text-sm">ID</th>
                      <th className="pb-3 font-bold text-sm">Name</th>
                      <th className="pb-3 font-bold text-sm">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan="3" className="py-4 text-center text-gray-400 font-medium">No students found. Add one!</td></tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="border-b border-rose-50 hover:bg-rose-50/50 transition-colors">
                          <td className="py-4 text-gray-500 font-semibold">#{student.id}</td>
                          <td className="py-4 text-gray-800 font-bold">{student.name}</td>
                          <td className="py-4 text-gray-500 font-medium">{student.email}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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