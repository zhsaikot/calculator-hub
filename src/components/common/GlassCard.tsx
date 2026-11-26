import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`
        bg-zinc-900/90 [data-theme="light"]:bg-white
        border border-zinc-800 [data-theme="light"]:border-slate-200
        rounded-xl shadow-sm transition-all duration-200
        ${hoverEffect ? 'hover:border-zinc-700 [data-theme="light"]:hover:border-slate-300 hover:shadow-md' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
