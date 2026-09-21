import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border border-[#e6d5e2] dark:border-white/10 bg-white/50 dark:bg-[#231123]/50 text-[#231123] dark:text-white placeholder-[#81737e] focus:outline-hidden focus:ring-2 focus:ring-[#B80C09] transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export default Input;
