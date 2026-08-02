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
    sm: { icon: 32, text: 'text-xl', gap: 'gap-2' },
    md: { icon: 44, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { icon: 60, text: 'text-3xl', gap: 'gap-3' },
    xl: { icon: 88, text: 'text-4xl', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Precision Scalable SVG Logo (No background card/box) */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Top 'F' Wing Gradient: Green/Teal to Cyan */}
          <linearGradient id="ft_wing_grad" x1="20" y1="20" x2="160" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00e5a3" />
            <stop offset="50%" stopColor="#00c8e5" />
            <stop offset="100%" stopColor="#0099ff" />
          </linearGradient>

          {/* Bar Chart 1 (Left) */}
          <linearGradient id="ft_bar1" x1="40" y1="180" x2="40" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a2540" />
            <stop offset="100%" stopColor="#004eb3" />
          </linearGradient>

          {/* Bar Chart 2 (Middle) */}
          <linearGradient id="ft_bar2" x1="80" y1="180" x2="80" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0040c8" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>

          {/* Bar Chart 3 (Right) */}
          <linearGradient id="ft_bar3" x1="120" y1="180" x2="120" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="#0099ff" />
          </linearGradient>

          {/* Upward Arrow Gradient */}
          <linearGradient id="ft_arrow_grad" x1="30" y1="170" x2="175" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00e5a3" />
            <stop offset="50%" stopColor="#00c8e5" />
            <stop offset="100%" stopColor="#00b8e6" />
          </linearGradient>

          {/* Text 'track' Gradient */}
          <linearGradient id="ft_text_track" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052cc" />
            <stop offset="50%" stopColor="#0080ff" />
            <stop offset="100%" stopColor="#00b8e6" />
          </linearGradient>
        </defs>

        {/* --- 1. Top Stylized 'F' Wing --- */}
        <path
          d="M 28 128 C 22 92 38 48 78 34 C 108 23 162 24 172 24 C 146 42 108 42 88 50 C 72 56 64 74 64 92 C 98 76 142 76 156 78 C 138 92 92 92 64 104 L 58 126 Z"
          fill="url(#ft_wing_grad)"
        />

        {/* --- 2. Three Vertical Bar Chart Columns --- */}
        {/* Left Bar (Short) */}
        <rect x="32" y="132" width="26" height="34" rx="10" fill="url(#ft_bar1)" />

        {/* Middle Bar (Medium) */}
        <rect x="68" y="108" width="26" height="58" rx="10" fill="url(#ft_bar2)" />

        {/* Right Bar (Tall) */}
        <rect x="104" y="80" width="26" height="86" rx="10" fill="url(#ft_bar3)" />

        {/* --- 3. Upward Diagonal Trend Arrow Slicing Across Bars --- */}
        <path
          d="M 26 160 C 75 138 110 108 172 68"
          stroke="url(#ft_arrow_grad)"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Arrowhead */}
        <path
          d="M 148 68 L 176 68 L 176 96"
          stroke="url(#ft_arrow_grad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Name Typography matching user's image */}
      {showText && variant === 'full' && (
        <div className="flex items-center leading-none">
          <span className={`${currentSize.text} font-black tracking-tight flex items-center`}>
            <span className="text-[#07172c]">Fin</span>
            <span className="bg-gradient-to-r from-[#0052cc] via-[#0080ff] to-[#00b8e6] bg-clip-text text-transparent">
              track
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
