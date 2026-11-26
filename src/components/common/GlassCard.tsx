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
        bg-white/[0.04] dark:bg-white/[0.04] [data-theme="light"]:bg-white/80
        backdrop-blur-xl border border-white/10 dark:border-white/10 [data-theme="light"]:border-indigo-100
        rounded-2xl shadow-xl transition-all duration-300
        ${hoverEffect ? 'hover:translate-y-[-4px] hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
