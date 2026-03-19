import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, ArrowLeft, Terminal, Activity, Server, CheckCircle2, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '../services/storage';
import Button from '../components/Button';
import Input from '../components/Input';

const AdminRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: ''
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.includes('admin')) {
      toast.error("Email must contain 'admin' for system authorization");
      return;
    }

    setLoading(true);

    try {
      // Generate password: DOB (YYYYMMDD) + FirstName
      const dobClean = formData.dob.replace(/-/g, '');
      const firstName = formData.name.split(' ')[0].toLowerCase();
      const password = `${dobClean}${firstName}`;
      setGeneratedPassword(password);

      // Simulate Admin Registration API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save admin to localStorage
      storageService.addAdmin({
        name: formData.name,
        email: formData.email,
        password: password
      });
      
      setSubmitted(true);
      toast.success("Admin provisioned with system-generated credentials!");
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
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
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20 mb-6 border-4 border-slate-900">
                  <ShieldCheck size={40} />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase tracking-widest">Admin Registration</h1>
                <p className="text-slate-400 font-medium">Provision New Administrator Account</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="System Admin"
                      value={formData.name}
                      onChange={handleChange}
                      icon={User}
                      required
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 mb-0 focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Auth Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@trustbank.com"
                      value={formData.email}
                      onChange={handleChange}
                      icon={Mail}
                      required
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 mb-0 focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      icon={Calendar}
                      required
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 mb-0 focus:border-blue-500/50"
                    />
                    <p className="text-[10px] text-blue-500/50 font-mono mt-1 ml-1 uppercase tracking-tighter">
                      Used to generate secure credentials
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-black bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-xl shadow-blue-500/10 text-white border-none mt-2"
                    loading={loading}
                  >
                    Provision Account
                  </Button>
                </form>
              </div>

              <div className="mt-8 flex flex-col items-center gap-6">
                <Link 
                  to="/admin/login" 
                  className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  <ArrowLeft size={16} />
                  Return to Admin Login
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-2xl shadow-blue-500/20">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-widest">Admin Provisioned</h2>
              <p className="text-slate-400 font-medium mb-6 leading-relaxed">
                Administrator account for <span className="text-blue-400 font-bold">{formData.email}</span> has been successfully added.
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Lock size={80} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Generated Credentials</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">Username/Email</p>
                    <p className="text-sm font-mono text-white">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">Generated Password (DOB+Name)</p>
                    <p className="text-lg font-mono text-blue-400 font-bold tracking-widest">{generatedPassword}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/admin/login')}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white border-none"
                >
                  Proceed to Login
                </Button>
                <div className="flex items-center justify-center gap-4 px-6 py-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                  <Terminal size={14} className="text-blue-500" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Auth: Verified</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminRegistrationPage;
