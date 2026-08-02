import React from 'react';
import { TabType } from '../types';

interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const items: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home', icon: 'dashboard' },
    { id: 'transactions', label: 'Activity', icon: 'receipt_long' },
    { id: 'analytics', label: 'Insights', icon: 'analytics' },
    { id: 'budget', label: 'Budget', icon: 'payments' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-[#c7c4d8]/30 px-2 py-1.5 flex justify-around items-center shadow-[0_-4px_20px_0_rgba(0,0,0,0.06)]">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
              isActive ? 'text-[#3525cd]' : 'text-[#777587] hover:text-[#0b1c30]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 bg-[#3525cd] rounded-full absolute -bottom-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
