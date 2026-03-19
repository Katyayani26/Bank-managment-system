import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, CheckCircle2, Globe, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';
import { storageService } from '../services/storage';
import Button from '../components/Button';
import Input from '../components/Input';

const RequestAccountPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save request to localStorage
      storageService.addRequest({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: 'Savings' // Default type
      });
      
      setSubmitted(true);
      toast.success("Request submitted successfully!");
    } catch (error) {
      toast.error(error.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-['Inter'] overflow-hidden">
      {/* Left Side: Decorative/Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -ml-96 -mt-96"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -mr-72 -mb-72"></div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/login" className="inline-flex items-center gap-2 text-blue-400 font-bold mb-12 hover:text-blue-300 transition-colors">
              <ArrowLeft size={18} />
              Back to Login
            </Link>
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
              Join the future of <span className="text-blue-400">secure banking</span>.
            </h2>
            <p className="text-slate-400 text-lg font-medium mb-12">
              Apply for an account in minutes and get access to our premium digital banking suite.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-blue-400 mb-3 font-black text-2xl">0%</div>
                <div className="text-white font-bold text-sm">Transfer Fees</div>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-blue-400 mb-3 font-black text-2xl">24/7</div>
                <div className="text-white font-bold text-sm">Active Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10 bg-white overflow-y-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              <div className="mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-200 mb-6">
                  🏦
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Request Access</h1>
                <p className="text-slate-500 font-medium">Start your journey with TrustBank today.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full Name"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  icon={User}
                  required
                />

                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    required
                  />
                  <Input
                    label="Confirm"
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={Lock}
                    required
                  />
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-6">
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    By submitting this request, you agree to our <button type="button" className="font-bold underline">Terms of Service</button> and <button type="button" className="font-bold underline">Privacy Policy</button>.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-black bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all shadow-xl shadow-slate-200"
                  loading={loading}
                >
                  Submit Request
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 font-black hover:underline">Sign In</Link>
                </p>
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
                <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Request Submitted!</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Thank you for choosing TrustBank. Our administration team will review your application and send an invitation to <span className="text-slate-900 font-bold">{formData.email}</span> shortly.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 rounded-2xl font-black"
                >
                  Return to Login
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  Your data is protected
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RequestAccountPage;
