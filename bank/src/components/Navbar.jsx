import React from 'react';
import { Menu, Bell, User, Search, Settings, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Navbar = ({ toggleSidebar, user = {}, className = '' }) => {
  return (
    <nav className={twMerge(clsx(
      'sticky top-0 z-30 h-20 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between',
      className
    ))}>
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 md:hidden transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search transactions, bills, or help..."
            className="block w-80 px-4 py-2.5 pl-12 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 focus:bg-white outline-none transition-all placeholder:text-slate-400"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-widest">⌘K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1 mr-4">
          <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
            <HelpCircle size={20} />
          </button>
          <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
            <Settings size={20} />
          </button>
        </div>

        <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all relative group">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-100 mx-2"></div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="hidden md:block text-right">
            <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none mb-1">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">{user?.role || 'Customer'}</p>
          </div>
          <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all overflow-hidden relative">
            {user?.avatar && user.role !== 'Admin' ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-sm">{user?.name?.charAt(0) || <User size={20} />}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
