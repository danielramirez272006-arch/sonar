import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#B80C09]/40';

  const variants = {
    primary: 'bg-[#B80C09] hover:bg-[#9c0a07] text-white shadow-xs',
    secondary: 'bg-[#4B2840] hover:bg-[#3d2034] text-white shadow-xs',
    outline: 'border border-[#e6d5e2] dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[#231123] dark:text-[#FAF5F8]',
    ghost: 'hover:bg-black/5 dark:hover:bg-white/5 text-[#5c435a] dark:text-[#B89CB0]',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
