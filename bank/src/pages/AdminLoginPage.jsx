import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, LogIn, ArrowLeft, Terminal, Activity, Server } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { storageService, STORAGE_KEYS } from '../services/storage';
import Button from '../components/Button';
import Input from '../components/Input';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user.role === 'Admin') {
      navigate('/admin');
    } else if (token && user.role === 'Customer') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate Admin API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verify against localStorage admins
      const admins = storageService.getAdmins();
      const adminUser = admins.find(a => a.email === email && a.password === password);

      if (!adminUser) {
        throw new Error("Invalid Administrator Credentials");
      }

      const userData = {
        ...adminUser,
        role: 'Admin',
        avatar: adminUser.avatar || 'https://i.pravatar.cc/150?img=33'
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, 'admin-token-' + Date.now());
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
      
      toast.success(`Welcome to the Admin Portal`);
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Access Denied. Please contact system admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-['Inter'] overflow-hidden relative">
      {/* Matrix-like decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
      </div>

      <div className="w-full flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20 mb-6 border-4 border-slate-900">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase tracking-widest">Admin Portal</h1>
            <p className="text-slate-400 font-medium">Restricted Access • Authorized Personnel Only</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            {/* Inner decorative light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

            <form onSubmit={handleAdminLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identifier</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@trustbank.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 mb-0 focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Secure Token</label>
                  <span className="text-[10px] text-blue-500/50 font-mono uppercase tracking-tighter">Format: YYYYMMDDfirstname</span>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  required
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 mb-0 focus:border-blue-500/50"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Activity size={12} className="text-emerald-500" />
                  System: Online
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Server size={12} className="text-blue-500" />
                  DB: Encrypted
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-base font-black bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-xl shadow-blue-500/10 text-white border-none"
                loading={loading}
              >
                Verify & Enter
              </Button>
            </form>
          </div>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link 
                to="/admin/register" 
                className="text-xs font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                Provision Admin
              </Link>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <Link 
                to="/" 
                className="text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Selection
              </Link>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <Link 
                to="/login" 
                className="text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Customer Login
              </Link>
            </div>
            
            <div className="flex items-center gap-4 px-6 py-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
              <Terminal size={14} className="text-blue-500" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Version 4.2.1-SECURE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
