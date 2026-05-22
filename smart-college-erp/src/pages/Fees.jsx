import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, Users, Calendar as CalendarIcon, 
  FileText, LogOut, CreditCard, DollarSign 
} from 'lucide-react';

export default function Fees() {
  const navigate = useNavigate();
  const [feesList, setFeesList] = useState([]);
  
  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all students and their fee status
  const fetchFees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fees`);
      if (response.ok) {
        const data = await response.json();
        setFeesList(data);
      }
    } catch (error) {
      console.error("Failed to fetch fees data", error);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // Handle submitting the fee update
  const handleUpdateFee = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedStudentId) {
      setMessage('❌ Please select a student first.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          student_id: selectedStudentId, 
          total_amount: totalAmount, 
          amount_paid: amountPaid, 
          due_date: dueDate 
        }),
      });

      if (response.ok) {
        setMessage('✅ Fee record updated successfully!');
        setTotalAmount('');
        setAmountPaid('');
        setDueDate('');
        setSelectedStudentId('');
        fetchFees(); // Refresh the table
      } else {
        setMessage('❌ Failed to update fee record.');
      }
    } catch (error) {
      setMessage('❌ Server connection error.');
    }
  };

  // When a user clicks a student in the table, populate the form
  const handleSelectStudent = (student) => {
    setSelectedStudentId(student.student_id);
    setTotalAmount(student.total_amount || '');
    setAmountPaid(student.amount_paid || '');
    setDueDate(student.due_date ? new Date(student.due_date).toISOString().split('T')[0] : '');
    setMessage('');
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
            <Activity className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          <Link to="/students" className="relative flex justify-center group">
            <Users className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          <Link to="/calendar" className="relative flex justify-center group">
            <CalendarIcon className="w-7 h-7 hover:text-rose-400 cursor-pointer transition-colors" />
          </Link>

          {/* Fees (ACTIVE PAGE) */}
          <Link to="/fees" className="relative flex justify-center group">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-rose-500 rounded-r-full"></div>
            <FileText className="w-7 h-7 text-rose-500 cursor-pointer" />
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
      <div className="flex-1 flex flex-col p-8 gap-6 h-full overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Fees Ledger</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* Update Fee Form */}
          <div className="lg:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-rose-50 h-fit">
            <h3 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-500" /> Update Fee Record
            </h3>
            
            {message && (
              <p className={`mb-4 text-sm font-bold p-3 rounded-lg ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {message}
              </p>
            )}

            <form onSubmit={handleUpdateFee} className="flex flex-col gap-4">
              <div className="bg-rose-50 text-rose-500 text-sm font-bold p-3 rounded-xl mb-2 text-center border border-rose-100">
                {selectedStudentId ? `Selected Student ID: #${selectedStudentId}` : 'Click a student in the table to select'}
              </div>

              <div className="relative">
                <DollarSign className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="number" step="0.01" placeholder="Total Fee Amount" required value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} disabled={!selectedStudentId} className="w-full bg-rose-50/50 rounded-xl py-3 pl-12 pr-4 outline-none border border-rose-100 focus:border-rose-400 text-gray-700 font-medium disabled:opacity-50" />
              </div>
              <div className="relative">
                <DollarSign className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="number" step="0.01" placeholder="Amount Paid So Far" required value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} disabled={!selectedStudentId} className="w-full bg-rose-50/50 rounded-xl py-3 pl-12 pr-4 outline-none border border-rose-100 focus:border-rose-400 text-gray-700 font-medium disabled:opacity-50" />
              </div>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={!selectedStudentId} className="w-full bg-rose-50/50 rounded-xl py-3 pl-12 pr-4 outline-none border border-rose-100 focus:border-rose-400 text-gray-700 font-medium disabled:opacity-50" />
              </div>
              
              <button type="submit" disabled={!selectedStudentId} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Save Record
              </button>
            </form>
          </div>

          {/* Fees Data Table */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-rose-50 overflow-hidden flex flex-col min-h-[400px]">
            <h3 className="text-xl font-extrabold text-gray-800 mb-6">Student Fee Status</h3>
            <div className="overflow-auto flex-1 pr-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-rose-100 text-gray-400">
                    <th className="pb-3 font-bold text-sm">Student</th>
                    <th className="pb-3 font-bold text-sm">Total Fee</th>
                    <th className="pb-3 font-bold text-sm">Paid</th>
                    <th className="pb-3 font-bold text-sm">Balance</th>
                    <th className="pb-3 font-bold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feesList.length === 0 ? (
                    <tr><td colSpan="5" className="py-4 text-center text-gray-400 font-medium">No students found.</td></tr>
                  ) : (
                    feesList.map((student) => {
                      const total = parseFloat(student.total_amount) || 0;
                      const paid = parseFloat(student.amount_paid) || 0;
                      const balance = total - paid;
                      const isFullyPaid = total > 0 && balance <= 0;

                      return (
                        <tr 
                          key={student.student_id} 
                          onClick={() => handleSelectStudent(student)}
                          className="border-b border-rose-50 hover:bg-rose-50/80 transition-colors cursor-pointer"
                        >
                          <td className="py-4">
                            <p className="font-bold text-gray-800">{student.name}</p>
                            <p className="text-xs text-gray-400">ID: #{student.student_id}</p>
                          </td>
                          <td className="py-4 text-gray-600 font-medium">${total.toFixed(2)}</td>
                          <td className="py-4 text-emerald-500 font-bold">${paid.toFixed(2)}</td>
                          <td className="py-4 text-rose-500 font-bold">${balance > 0 ? balance.toFixed(2) : '0.00'}</td>
                          <td className="py-4">
                            {total === 0 ? (
                              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Unassigned</span>
                            ) : isFullyPaid ? (
                              <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Paid</span>
                            ) : (
                              <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

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
