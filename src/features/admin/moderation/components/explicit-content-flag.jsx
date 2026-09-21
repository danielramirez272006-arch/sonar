import React from 'react';

export const ExplicitContentFlag = ({ flagged = false, reason = 'Lenguaje inapropiado' }) => {
  if (!flagged) return null;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      <span>{reason}</span>
    </span>
  );
};

export default ExplicitContentFlag;
