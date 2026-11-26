import React from 'react';

interface BdFlagIconProps {
  className?: string;
}

/**
 * Official Bangladesh Flag SVG Icon
 * Ratio 10:6, Forest Green (#006A4E) with Red Disc (#F42A41) slightly shifted hoist-side (cx=9/20)
 * Works consistently across all OS platforms (Windows, macOS, Linux, iOS, Android)
 */
export const BdFlagIcon: React.FC<BdFlagIconProps> = ({ className = 'w-4 h-2.5' }) => {
  return (
    <svg
      viewBox="0 0 20 12"
      className={`inline-block rounded-[2px] shadow-xs flex-shrink-0 align-middle ${className}`}
      aria-label="Bangladesh Flag"
      role="img"
    >
      <rect width="20" height="12" fill="#006A4E" />
      <circle cx="9" cy="6" r="4.2" fill="#F42A41" />
    </svg>
  );
};
