import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 rounded-3xl p-6 shadow-sm transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
