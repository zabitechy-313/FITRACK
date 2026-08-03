import React from 'react';
import logoImg from '../assets/images/finzab_logo_png_final_1785720052224.jpg';

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
  // Sizing scale for logo image (increased sizes)
  const sizeMap = {
    sm: { icon: 'w-10 h-10' },
    md: { icon: 'w-14 h-14' },
    lg: { icon: 'w-20 h-20' },
    xl: { icon: 'w-28 h-28' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {/* PNG Logo Asset with clean background blend mode */}
      <img
        src={logoImg}
        alt="Logo"
        referrerPolicy="no-referrer"
        className={`${currentSize.icon} object-contain mix-blend-multiply bg-transparent flex-shrink-0 select-none`}
      />
    </div>
  );
};

