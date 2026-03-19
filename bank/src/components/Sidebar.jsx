import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Send,
  History, 
  LogOut, 
  ShieldCheck, 
  CreditCard,
  Settings,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { authService } from '../services/api';

const Sidebar = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Deposit', path: '/deposit', icon: ArrowUpCircle },
    { name: 'Withdraw', path: '/withdraw', icon: ArrowDownCircle },
    { name: 'Transfer', path: '/transfer', icon: Send },
    { name: 'Transactions', path: '/transactions', icon: History },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Control', path: '/admin', icon: ShieldCheck });
  }

  const bottomItems = [
    { name: 'Settings', path: '/dashboard', icon: Settings },
    { name: 'Help Support', path: '/dashboard', icon: HelpCircle },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-all duration-300">
      <div className="p-8 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
          🏦
        </div>
        <span className="text-xl font-black text-white tracking-tighter">TrustBank</span>
      </div>

      <div className="px-4 py-2 flex-grow overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                twMerge(clsx(
                  'flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 group relative',
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                ))
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-10 mb-4">Others</p>
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200 group"
            >
              <item.icon size={20} className="text-slate-500 group-hover:text-blue-400" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="p-4 rounded-3xl bg-white/5 border border-white/5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 font-black text-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-black text-white truncate">{user.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 font-bold truncate uppercase tracking-widest">{user.role || 'Customer'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-red-400 bg-red-400/10 hover:bg-red-400 hover:text-white transition-all duration-200"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <ShieldCheck size={12} />
          Secure Session
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
