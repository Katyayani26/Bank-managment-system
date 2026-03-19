import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Send, 
  History, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  ArrowRight,
  ChevronRight,
  Activity,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

import { storageService, STORAGE_KEYS } from '../services/storage';

const CustomerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
        if (current) {
          setUserData(current);
          
          // Fetch real transactions for this user
          const transactions = storageService.getTransactions(current.email);
          setRecentTransactions(transactions.slice(0, 4));
          
          // Fetch real goals
          const userGoals = storageService.getGoals(current.email);
          setGoals(userGoals);

          // Get unique recent transfer recipients
          const transfers = transactions.filter(t => t.type === 'Transfer' && t.recipientEmail);
          const uniqueRecipients = [];
          const seenEmails = new Set();
          
          for (const t of transfers) {
            if (!seenEmails.has(t.recipientEmail)) {
              seenEmails.add(t.recipientEmail);
              uniqueRecipients.push({
                email: t.recipientEmail,
                name: t.recipientName || t.recipientEmail.split('@')[0]
              });
            }
            if (uniqueRecipients.length >= 3) break;
          }
          setRecentRecipients(uniqueRecipients);
          
          // Generate simple balance history for chart (last 7 transactions or mock if few)
          const history = transactions.slice(0, 7).reverse().map(t => t.balance);
          if (history.length < 7) {
            // Pad with initial balance or zero if not enough history
            const padding = new Array(7 - history.length).fill(history[0] || 0);
            setBalanceHistory([...padding, ...history]);
          } else {
            setBalanceHistory(history);
          }
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) {
      toast.error('Please fill in all fields');
      return;
    }

    const goal = storageService.addGoal({
      userEmail: userData.email,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: 0
    });

    setGoals([...goals, goal]);
    setShowGoalModal(false);
    setNewGoal({ name: '', target: '' });
    toast.success('Saving goal added!');
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0 },
    },
  };

  const chartData = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        fill: true,
        label: 'Balance',
        data: balanceHistory.length > 0 ? balanceHistory : [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
      },
    ],
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <LoadingSpinner size="lg" message="Personalizing your workspace..." />
    </div>
  );

  const quickActions = [
    { name: 'Deposit', icon: ArrowUpCircle, path: '/deposit', color: 'bg-blue-600 shadow-blue-200' },
    { name: 'Withdraw', icon: ArrowDownCircle, path: '/withdraw', color: 'bg-indigo-600 shadow-indigo-200' },
    { name: 'Transfer', icon: Send, path: '/transfer', color: 'bg-violet-600 shadow-violet-200' },
    { name: 'Bills', icon: Calendar, path: '/transactions', color: 'bg-emerald-600 shadow-emerald-200' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-['Inter']">
      <Sidebar />
      
      <main className="flex-grow ml-64 min-h-screen flex flex-col transition-all duration-300">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={userData} />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                Hello, {userData?.name} 👋
              </h1>
              <p className="text-slate-500 font-medium">Welcome back! Your finances are looking great.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {recentRecipients.map((recipient, i) => (
                  <div 
                    key={recipient.email} 
                    className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs cursor-pointer hover:scale-110 transition-transform shadow-sm"
                    title={`Send to ${recipient.name}`}
                    onClick={() => navigate('/transfer', { state: { email: recipient.email } })}
                  >
                    {recipient.name.charAt(0)}
                  </div>
                ))}
                <button 
                  onClick={() => navigate('/transfer')}
                  className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform shadow-lg"
                  title="New Transfer"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-sm font-bold text-slate-700">Send money again</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Main Balance Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8"
            >
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white banking-shadow-xl relative overflow-hidden group min-h-[340px] flex flex-col justify-between">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                        <Wallet size={24} className="text-blue-400" />
                      </div>
                      <span className="text-slate-400 font-semibold tracking-wide uppercase text-xs">Total Balance</span>
                    </div>
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold uppercase tracking-widest">Active Now</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end gap-6">
                    <div>
                      <h2 className="text-6xl font-black tracking-tighter mb-2">
                        ₹{userData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </h2>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md text-sm font-bold">
                          <TrendingUp size={16} />
                          <span>+12.5%</span>
                        </div>
                        <span className="text-slate-400 text-sm font-medium">than last month</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow h-24 mt-4">
                      <Line options={chartOptions} data={chartData} />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Account Number</p>
                      <p className="font-mono font-medium tracking-wider">**** **** 8241</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Card Holder</p>
                      <p className="font-medium tracking-wide uppercase">{userData?.name}</p>
                    </div>
                  </div>
                  <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-lg hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4 space-y-6"
            >
              <Card className="h-full border-none shadow-sm flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-slate-900 font-extrabold text-lg">Quick Actions</h3>
                    <Activity size={20} className="text-slate-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                      <button
                        key={action.name}
                        onClick={() => navigate(action.path)}
                        className="group flex flex-col items-start gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-left"
                      >
                        <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                          <action.icon size={22} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{action.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/transactions')}
                  className="w-full mt-6 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors group"
                >
                  View Activity Report
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8"
            >
              <Card 
                className="border-none shadow-sm"
                title="Recent Transactions" 
                titleAction={<button onClick={() => navigate('/transactions')} className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View All History</button>}
              >
                <div className="space-y-2 mt-2">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${tx.amount > 0 ? 'bg-emerald-50' : 'bg-slate-100'} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                            {tx.icon || (tx.amount > 0 ? '💰' : '💸')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{tx.type}</p>
                            <p className="text-xs text-slate-500 font-medium">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.category}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <History size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">No transactions yet</p>
                      <p className="text-xs text-slate-400">Your recent activity will appear here</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-4 space-y-8"
            >
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-slate-900 font-extrabold">Saving Goals</h4>
                  <button 
                    onClick={() => setShowGoalModal(true)}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Add New Goal"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  {goals.length > 0 ? (
                    goals.map((goal) => {
                      const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                      return (
                        <div key={goal.id}>
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
                            <span className="text-slate-700">{goal.name}</span>
                            <span className="text-blue-600">{percentage}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                            ></motion.div>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[11px] font-bold text-slate-500">
                              ₹{goal.current.toLocaleString()} <span className="text-slate-300 mx-1">/</span> ₹{goal.target.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-medium px-4">No saving goals set yet. Start saving for your dreams!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">Create New Goal</h3>
                <button 
                  onClick={() => setShowGoalModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <Activity size={20} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Goal Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Dream Car, Vacation, House"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Amount (₹)</label>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    required
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="flex-grow py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDashboard;
