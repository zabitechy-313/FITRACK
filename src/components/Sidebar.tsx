import React from 'react';
import { TabType, UserProfile } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  isOpen = false,
  onClose,
}) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'receipt_long' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'budget', label: 'Budget', icon: 'payments' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 flex flex-col py-6 border-r border-[#c7c4d8]/30 bg-[#f8f9ff]/95 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3525cd] tracking-tight">FinTrack</h1>
            <p className="text-[#464555] text-xs font-label-caps uppercase tracking-widest mt-0.5">
              Financial Wellness
            </p>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-full hover:bg-[#eff4ff] text-[#464555] hover:text-[#0b1c30] transition-all"
            title="Close menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-left ${
                  isActive
                    ? 'text-[#3525cd] font-bold border-r-4 border-[#3525cd] bg-[#3525cd]/5'
                    : 'text-[#464555] hover:bg-[#dce9ff]/50 hover:text-[#0b1c30]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 mt-auto pt-4 border-t border-[#c7c4d8]/20">
          <div
            onClick={() => handleTabClick('settings')}
            className="glass-card rounded-2xl p-3.5 flex items-center gap-3 hover:bg-white/80 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#3525cd] flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden flex-shrink-0 relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover object-center rounded-full block"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="uppercase text-xs font-bold">{user.initials}</span>
              )}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="font-bold text-sm text-[#0b1c30] truncate">{user.name}</p>
              <p className="text-xs text-[#464555] truncate">{user.plan}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
