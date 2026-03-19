import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  className = '', 
  required = false, 
  disabled = false, 
  icon: Icon 
}) => {
  return (
    <div className={twMerge(clsx('mb-4 w-full', className))}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={twMerge(clsx(
            'block w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-blue-100 focus:border-blue-500',
            Icon ? 'pl-10' : 'pl-4',
            error ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300' : 'border-gray-200 bg-white placeholder-gray-400 text-gray-900',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-60'
          ))}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
