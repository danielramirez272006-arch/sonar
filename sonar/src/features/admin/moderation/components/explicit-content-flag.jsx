import React from 'react';

export const ExplicitContentFlag = ({ flagged = false, reason = 'Lenguaje inapropiado' }) => {
  if (!flagged) return null;

  return (
    <span
      style={{ backgroundColor: '#4B2840', color: '#DCDCDD', borderColor: '#003844' }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs"
    >
      <span style={{ backgroundColor: '#B80C09' }} className="w-1.5 h-1.5 rounded-full" />
      <span>{reason}</span>
    </span>
  );
};

export default ExplicitContentFlag;
