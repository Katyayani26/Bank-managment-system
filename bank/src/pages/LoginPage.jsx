import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, ArrowRight, CheckCircle2, Globe, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';
import { storageService, STORAGE_KEYS } from '../services/storage';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user.role === 'Customer') {
      navigate('/dashboard');
    } else if (token && user.role === 'Admin') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email.includes('admin')) {
        toast.error("Administrator access restricted. Use the Admin Portal.");
        setLoading(false);
        return;
      }

      // Verify against localStorage accounts
      const accounts = storageService.getAccounts();
      const userAccount = accounts.find(acc => acc.email === email && acc.password === password);

      if (!userAccount) {
        throw new Error("Invalid email or password");
      }

      if (userAccount.status !== 'Active') {
        throw new Error("Your account is pending approval or has been restricted.");
      }

      const userData = {
        ...userAccount,
        role: 'Customer'
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, 'customer-token-' + Date.now());
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
      
      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-['Inter'] overflow-hidden">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-200 mb-6">
              🏦
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Please enter your details to sign in to your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              className="mb-0"
            />

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot password?</button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
                className="mb-0"
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-base font-black bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all shadow-xl shadow-slate-200"
              loading={loading}
            >
              Sign In to Account
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">New to TrustBank?</p>
            <Link to="/request-account" className="text-sm font-black text-blue-600 hover:underline">Request an Account</Link>
          </div>

          <div className="mt-12 flex flex-col gap-6">
            <div className="flex items-center justify-center gap-6">
              <Link to="/" className="text-[10px] font-black text-slate-400 hover:text-blue-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
                <ArrowLeft size={12} />
                Back to Selection
              </Link>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <Link to="/admin/login" className="text-[10px] font-bold text-slate-300 hover:text-blue-500 uppercase tracking-[0.2em] transition-colors">
                Internal Administrator Access
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secure SSL
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 size={14} className="text-emerald-500" />
                FDIC Insured
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Decorative/Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -ml-72 -mb-72"></div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-8">
              <Globe size={14} className="text-blue-400" />
              Trusted by 2M+ users worldwide
            </div>
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
              Experience the future of <span className="text-blue-400">digital banking</span> today.
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Zero Fees', desc: 'No hidden charges on transfers or withdrawals.' },
                { title: 'Instant Access', desc: 'Manage your funds from anywhere in the world.' },
                { title: 'Military-Grade Security', desc: 'Your data is protected by industry-leading encryption.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -5 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
          className="absolute bottom-12 right-12 w-80 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl banking-shadow-xl backdrop-blur-md border border-white/20"
        >
          <div className="flex justify-between items-start mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black italic text-xl">VISA</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Platinum Member</p>
            <p className="text-lg font-mono tracking-widest">**** **** **** 8241</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
