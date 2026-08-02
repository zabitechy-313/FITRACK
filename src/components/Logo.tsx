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
    sm: { icon: 34, text: 'text-xl', tagline: 'text-[7.5px]', gap: 'gap-2' },
    md: { icon: 48, text: 'text-2xl', tagline: 'text-[9px]', gap: 'gap-2.5' },
    lg: { icon: 64, text: 'text-3xl', tagline: 'text-[11px]', gap: 'gap-3' },
    xl: { icon: 92, text: 'text-4xl', tagline: 'text-[13px]', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Precision SVG Icon matching exact logo design with transparent background */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Main F Outer Loop Gradient: Deep Navy -> Ocean Teal -> Vibrant Emerald Green */}
          <linearGradient id="fit_loop_grad" x1="40" y1="200" x2="180" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06182a" />
            <stop offset="25%" stopColor="#033246" />
            <stop offset="55%" stopColor="#007d7b" />
            <stop offset="82%" stopColor="#00c885" />
            <stop offset="100%" stopColor="#00f09e" />
          </linearGradient>

          {/* Middle Horizontal Bar Gradient */}
          <linearGradient id="fit_mid_bar_grad" x1="75" y1="85" x2="145" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00b87c" />
            <stop offset="100%" stopColor="#00e599" />
          </linearGradient>

          {/* Bar 1 (Short Left Bar) */}
          <linearGradient id="fit_bar1" x1="0" y1="180" x2="0" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#05263a" />
            <stop offset="100%" stopColor="#005063" />
          </linearGradient>

          {/* Bar 2 (Middle Bar) */}
          <linearGradient id="fit_bar2" x1="0" y1="180" x2="0" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#005263" />
            <stop offset="100%" stopColor="#009e7c" />
          </linearGradient>

          {/* Bar 3 (Tall Right Bar) */}
          <linearGradient id="fit_bar3" x1="0" y1="180" x2="0" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00a87a" />
            <stop offset="100%" stopColor="#00e69b" />
          </linearGradient>

          {/* Brand Text 'Fin' Gradient */}
          <linearGradient id="fit_text_fin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00e699" />
            <stop offset="100%" stopColor="#00b87c" />
          </linearGradient>
        </defs>

        {/* --- 1. Main Outer 'F' Frame --- */}
        {/* Outer Top Loop & Vertical Stem */}
        <path
          d="M 68 185 C 50 185 40 172 40 150 L 40 75 C 40 45 62 30 102 30 L 165 30 C 172 30 178 36 175 43 C 172 50 162 55 150 55 L 102 55 C 82 55 72 65 72 82 L 72 150 C 72 165 80 170 95 170 L 162 170 C 172 170 178 178 172 185 C 168 189 155 185 142 185 Z"
          fill="url(#fit_loop_grad)"
        />

        {/* Middle 'F' Crossbar */}
        <path
          d="M 72 85 C 72 78 80 75 92 75 L 140 75 C 150 75 155 82 150 88 C 145 94 135 95 125 95 L 92 95 C 80 95 72 90 72 85 Z"
          fill="url(#fit_mid_bar_grad)"
        />

        {/* --- 2. Inside Bar Chart Columns --- */}
        {/* Bar 1 (Short) */}
        <rect x="90" y="138" width="20" height="32" rx="6" fill="url(#fit_bar1)" />

        {/* Bar 2 (Medium) */}
        <rect x="116" y="118" width="20" height="52" rx="6" fill="url(#fit_bar2)" />

        {/* Bar 3 (Tall Right) */}
        <rect x="142" y="92" width="20" height="78" rx="6" fill="url(#fit_bar3)" />

        {/* --- 3. White Upward Trend Line & Arrow --- */}
        <path
          d="M 78 162 C 105 156 128 148 166 120"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* White Arrowhead */}
        <path
          d="M 152 120 L 168 118 L 164 134"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Text Typography */}
      {showText && variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className={`${currentSize.text} font-black tracking-tight flex items-center`}>
            <span className="bg-gradient-to-r from-[#00e699] to-[#00b87c] bg-clip-text text-transparent">
              Fin
            </span>
            <span className="text-[#07172b]">
              track
            </span>
          </div>
          <span className={`${currentSize.tagline} font-extrabold tracking-[0.24em] text-[#6e7885] uppercase mt-1 pl-0.5`}>
            TRACK . MANAGE . GROW .
          </span>
        </div>
      )}
    </div>
  );
};
