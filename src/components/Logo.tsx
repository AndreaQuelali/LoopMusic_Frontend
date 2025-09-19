import React from 'react';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand" fill="currentColor">
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-lg font-bold tracking-wide">LOOP</div>
        <div className="text-[10px] uppercase text-white/60 tracking-[0.25em]">Music</div>
      </div>
    </div>
  );
}
