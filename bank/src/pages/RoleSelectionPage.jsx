import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const roles = [
    {
      id: 'customer',
      title: 'Personal Banking',
      description: 'Access your personal accounts, transfers, and daily transactions.',
      icon: User,
      color: 'blue',
      path: '/login',
      features: ['Easy Transfers', 'Bill Payments', 'Card Management']
    },
    {
      id: 'admin',
      title: 'Administrator Portal',
      description: 'Manage system users, approve account requests, and monitor system health.',
      icon: ShieldCheck,
      color: 'slate',
      path: '/admin/login',
      features: ['User Management', 'Request Approval', 'System Analytics']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter'] overflow-hidden">
      {/* Top Brand Bar */}
      <nav className="h-20 px-8 flex items-center justify-between border-b border-slate-50 relative z-20 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            🏦
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">TrustBank</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">
          <Globe size={14} className="text-blue-500" />
          Global Secure Network
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center p-8 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mb-16 relative z-10"
        >
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
            Welcome to the future of <span className="text-blue-600">Digital Finance</span>.
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Choose your portal to begin. Our multi-layered security ensures your data remains protected no matter your role.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => navigate(role.path)}
              className="group cursor-pointer bg-white rounded-[2.5rem] p-10 border border-slate-100 banking-shadow hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden h-full"
            >
              {/* Card Background Gradient */}
              <div className={`absolute top-0 right-0 w-48 h-48 ${role.color === 'blue' ? 'bg-blue-500/5' : 'bg-slate-900/5'} rounded-full blur-3xl -mr-24 -mt-24 transition-transform group-hover:scale-150`}></div>

              <div className={`w-16 h-16 ${role.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'} rounded-2xl flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110 duration-500`}>
                <role.icon size={32} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
                {role.title}
              </h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                {role.description}
              </p>

              <div className="space-y-3 mb-10">
                {role.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 ${role.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'} rounded-full flex items-center justify-center shrink-0`}>
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-black text-slate-900 group-hover:gap-4 transition-all uppercase tracking-widest">
                Access Portal
                <ArrowRight size={18} className="text-blue-600" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex items-center gap-8 text-slate-400 opacity-60">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            AES-256 Encryption
          </div>
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} />
            ISO 27001 Certified
          </div>
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <Globe size={14} />
            Global Compliance
          </div>
        </div>
      </div>

      <footer className="py-8 px-8 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs font-medium relative z-20 bg-white">
        <p>© 2026 TrustBank Financial Group Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <button className="hover:text-slate-900 transition-colors">Security</button>
          <button className="hover:text-slate-900 transition-colors">Privacy</button>
          <button className="hover:text-slate-900 transition-colors">Terms</button>
        </div>
      </footer>
    </div>
  );
};

export default RoleSelectionPage;
