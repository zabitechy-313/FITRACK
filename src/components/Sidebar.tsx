import React from 'react';
import { TabType, UserProfile } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  isOpen?: boolean;
  onClose?: () => void;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  isOpen = false,
  onClose,
  isLoggedIn = false,
  onOpenLogin,
  onLogout,
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
          <div className="flex flex-col">
            <Logo size="md" showText={true} />
            <p className="text-[#777587] text-[10px] font-label-caps uppercase tracking-widest mt-1 font-bold pl-1">
              Personal Wealth Manager
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

        {/* User Account Footer Card */}
        <div className="px-3.5 mt-auto pt-4 border-t border-[#c7c4d8]/20 space-y-2">
          {isLoggedIn ? (
            <div className="glass-card rounded-2xl p-2.5 flex items-center justify-between gap-2 border border-[#3525cd]/15">
              <div
                onClick={() => handleTabClick('settings')}
                className="flex items-center gap-2.5 overflow-hidden min-w-0 cursor-pointer flex-1"
              >
                <div className="w-10 h-10 rounded-full bg-[#3525cd] flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden flex-shrink-0 relative">
                  <span className="uppercase text-xs font-bold leading-none">{user.initials}</span>
                  {user.avatar ? (
                    <img
                      key={user.avatar}
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover object-center absolute inset-0 rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                <div className="overflow-hidden min-w-0 flex flex-col justify-center">
                  <p className="font-bold text-xs text-[#0b1c30] truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-[#006c49] font-bold truncate leading-tight mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] inline-block flex-shrink-0"></span>
                    <span>Logged In</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl hover:bg-red-50 text-[#ba1a1a] transition-colors flex-shrink-0 flex items-center justify-center"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#3525cd] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#2b1cb8] transition-all shadow-md shadow-[#3525cd]/20"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Log In / Sign Up</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
