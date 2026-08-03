import React from 'react';
import logoPng from '../assets/images/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
}) => {
  // Sizing scale for PNG logo image
  const sizeMap = {
    sm: { icon: 'w-10 h-10' },
    md: { icon: 'w-14 h-14' },
    lg: { icon: 'w-20 h-20' },
    xl: { icon: 'w-28 h-28' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {/* High Quality Transparent PNG Logo Asset */}
      <img
        src={logoPng}
        alt="Logo"
        referrerPolicy="no-referrer"
        className={`${currentSize.icon} object-contain flex-shrink-0 select-none`}
      />
    </div>
  );
};

