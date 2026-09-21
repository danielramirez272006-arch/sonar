import React from 'react';

export const LyricalContext = ({ analysis, quote }) => {
  if (!analysis && !quote) return null;

  return (
    <div className="rounded-3xl p-6 bg-[#4B2840]/60 border border-white/10 backdrop-blur-xs flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-bold text-[#B80C09] uppercase tracking-wider">
        <span>✦</span>
        <span>Análisis Contextual & Lírico (IA)</span>
      </div>
      {analysis && <p className="text-sm text-gray-200 leading-relaxed">{analysis}</p>}
      {quote && (
        <blockquote className="border-l-2 border-[#B80C09] pl-3 text-xs italic text-[#B89CB0]">
          «{quote}»
        </blockquote>
      )}
    </div>
  );
};

export default LyricalContext;
