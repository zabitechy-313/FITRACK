import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'full',
}) => {
  // Dimensions scaling
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 42, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { icon: 56, text: 'text-3xl', gap: 'gap-3' },
    xl: { icon: 80, text: 'text-4xl', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* SVG Icon */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <defs>
          {/* Top 'F' Green to Cyan Gradient */}
          <linearGradient id="fintrack_f_grad" x1="20" y1="20" x2="180" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00e5a3" />
            <stop offset="50%" stopColor="#00c8e5" />
            <stop offset="100%" stopColor="#0099ff" />
          </linearGradient>

          {/* Bar Charts Dark Blue Gradient */}
          <linearGradient id="fintrack_bar_grad" x1="60" y1="180" x2="140" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0b1c30" />
            <stop offset="50%" stopColor="#004ebd" />
            <stop offset="100%" stopColor="#0077ff" />
          </linearGradient>

          {/* Arrow Cyan Gradient */}
          <linearGradient id="fintrack_arrow_grad" x1="40" y1="160" x2="180" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00e5a3" />
            <stop offset="100%" stopColor="#00c8e5" />
          </linearGradient>

          {/* Text 'track' Gradient */}
          <linearGradient id="fintrack_text_grad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0055d4" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
        </defs>

        {/* 1. The Stylized 'F' Top Swoop and Arm */}
        <path
          d="M 50 120 C 45 90 55 50 85 36 C 110 24 165 24 175 24 C 150 42 105 42 88 50 C 78 55 72 70 72 85 C 105 70 145 70 160 72 C 140 86 100 86 72 98 L 68 118 Z"
          fill="url(#fintrack_f_grad)"
        />

        {/* 2. Three Bar Charts (Rising) */}
        {/* Bar 1 (Left, Short) */}
        <path
          d="M 55 140 C 55 135 59 130 65 130 L 75 130 C 81 130 85 134 85 140 L 85 160 C 85 163 80 165 72 165 C 62 165 55 155 55 140 Z"
          fill="url(#fintrack_bar_grad)"
        />

        {/* Bar 2 (Middle, Medium) */}
        <path
          d="M 95 118 C 95 113 99 108 105 108 L 115 108 C 121 108 125 113 125 118 L 125 165 L 95 165 Z"
          fill="url(#fintrack_bar_grad)"
        />

        {/* Bar 3 (Right, Tall) */}
        <path
          d="M 135 90 C 135 85 139 80 145 80 L 155 80 C 161 80 165 85 165 90 L 165 165 L 135 165 Z"
          fill="url(#fintrack_bar_grad)"
        />

        {/* 3. Growth Arrow slicing through */}
        <path
          d="M 40 162 L 165 82 M 165 82 L 140 80 M 165 82 L 163 105"
          stroke="url(#fintrack_arrow_grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Text */}
      {showText && variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={`${currentSize.text} font-black tracking-tight flex items-center`}>
            <span className="text-[#08162d]">Fin</span>
            <span className="text-[#00a8e8]">track</span>
          </span>
        </div>
      )}
    </div>
  );
};
