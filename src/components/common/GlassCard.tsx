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
        bg-white dark:bg-zinc-900
        border border-slate-200 dark:border-zinc-800
        rounded-xl shadow-sm transition-all duration-200
        ${hoverEffect ? 'hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
