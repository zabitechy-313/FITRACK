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
  // Sizing scale for icon & text
  const sizeMap = {
    sm: { icon: 34, text: 'text-xl', gap: 'gap-2' },
    md: { icon: 48, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { icon: 64, text: 'text-3xl', gap: 'gap-3' },
    xl: { icon: 92, text: 'text-4xl', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Precision SVG Icon matching exact Finzab logo design */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Electric Blue -> Vibrant Cyan Gradient */}
          <linearGradient id="finzab_cyan_grad" x1="40" y1="170" x2="160" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052ff" />
            <stop offset="50%" stopColor="#0088ff" />
            <stop offset="100%" stopColor="#00d2ff" />
          </linearGradient>
        </defs>

        {/* --- 1. Top Black 'F' Wing --- */}
        <path
          d="M 58 32 H 132 C 140 32 144 38 140 46 C 136 52 128 54 120 54 H 82 V 70 H 118 C 126 70 130 76 126 84 C 122 90 114 92 106 92 H 82 V 104 C 82 108 76 112 70 112 H 58 C 54 112 50 108 50 102 V 40 C 50 35 54 32 58 32 Z"
          fill="#141414"
        />

        {/* --- 2. Bottom Blue/Cyan Financial Monogram 'Z' & Chart --- */}
        {/* Short Left Bar */}
        <rect x="50" y="118" width="18" height="38" rx="5" fill="url(#finzab_cyan_grad)" />

        {/* Middle Bar */}
        <rect x="76" y="102" width="18" height="54" rx="5" fill="url(#finzab_cyan_grad)" />

        {/* Bottom Base Bar */}
        <path
          d="M 76 158 H 138 C 146 158 150 163 146 169 C 142 174 134 176 126 176 H 66 C 58 176 50 170 50 162 C 50 158 54 158 60 158 Z"
          fill="url(#finzab_cyan_grad)"
        />

        {/* Dynamic Upward Slicing Trend Arrow */}
        <path
          d="M 78 152 L 150 72"
          stroke="url(#finzab_cyan_grad)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Arrowhead */}
        <path
          d="M 130 70 L 154 68 L 152 92"
          stroke="url(#finzab_cyan_grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Text Typography */}
      {showText && variant === 'full' && (
        <div className="flex items-center leading-none">
          <div className={`${currentSize.text} font-black tracking-tight flex items-center font-sans`}>
            {/* 'fin' in black with cyan dot on the 'i' */}
            <span className="text-[#141414] flex items-center">
              f
              <span className="relative inline-flex flex-col items-center justify-center">
                <span className="w-[4.5px] h-[4.5px] rounded-full bg-[#00a8ff] absolute -top-[2px]"></span>
                <span className="mt-[2px]">i</span>
              </span>
              n
            </span>
            {/* 'zab' in cyan blue gradient */}
            <span className="bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] bg-clip-text text-transparent ml-[0.5px]">
              zab
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
