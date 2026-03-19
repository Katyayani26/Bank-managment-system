import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, title, subtitle, footer, className = '', titleAction, noPadding = false }) => {
  return (
    <div className={twMerge(clsx(
      'bg-white rounded-[2rem] border border-slate-100 overflow-hidden banking-shadow transition-all duration-300',
      className
    ))}>
      {(title || subtitle || titleAction) && (
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            {title && <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{title}</h3>}
            {subtitle && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
          </div>
          {titleAction && <div className="flex items-center">{titleAction}</div>}
        </div>
      )}
      <div className={clsx(noPadding ? 'p-0' : 'px-8 py-6')}>
        {children}
      </div>
      {footer && (
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
