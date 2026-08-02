import React, { useState } from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
  onToggleMobileMenu?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onToggleMobileMenu,
  unreadNotificationsCount = 2,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'transactions':
        return 'Search transactions...';
      case 'budget':
        return 'Search budget categories...';
      case 'analytics':
        return 'Search insights...';
      default:
        return 'Search transactions or categories...';
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-4 bg-[#f8f9ff]/80 backdrop-blur-2xl border-b border-[#c7c4d8]/20 z-40 transition-all">
      {/* Mobile Menu Hamburger Button & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] transition-colors flex items-center justify-center flex-shrink-0"
          title="Open menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] text-lg sm:text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full bg-[#eff4ff] border-none rounded-full py-2 sm:py-2.5 pl-10 sm:pl-11 pr-8 text-xs sm:text-sm text-[#0b1c30] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd]/20 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777587] hover:text-[#0b1c30] text-sm"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-2">
        {/* Quick Add Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#3525cd] text-white font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#3525cd]/25 active:scale-95 transition-all flex-shrink-0"
        >
          <span className="material-symbols-outlined text-base sm:text-lg">add</span>
          <span className="hidden sm:inline">
            {activeTab === 'budget' ? 'Set Budget' : 'Add Transaction'}
          </span>
          <span className="sm:hidden">
            {activeTab === 'budget' ? 'Budget' : 'Add'}
          </span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowHelp(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[#eff4ff] transition-all text-[#464555] relative flex-shrink-0"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 glass-card rounded-2xl p-4 shadow-xl border border-[#c7c4d8]/40 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d8]/20 mb-3">
                <h4 className="font-bold text-sm text-[#0b1c30]">Notifications</h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#3525cd] font-semibold hover:underline"
                >
                  Mark as read
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-lg mt-0.5">warning</span>
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30]">Shopping Budget Exceeded</p>
                    <p className="text-[11px] text-[#464555]">You spent $1,050 ($50 over limit)</p>
                    <span className="text-[10px] text-[#777587] mt-1 block">10 mins ago</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#e5eeff] border border-[#3525cd]/20 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#3525cd] text-lg mt-0.5">payments</span>
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30]">Income Received</p>
                    <p className="text-[11px] text-[#464555]">+$4,500.00 from Acme Corp</p>
                    <span className="text-[10px] text-[#777587] mt-1 block">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 sm:h-6 w-[1px] bg-[#c7c4d8]/40 hidden sm:block" />

        {/* Help Center Button */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setShowHelp(!showHelp);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#eff4ff] text-[#0b1c30] text-sm font-semibold transition-all"
          >
            <span>Help</span>
            <span className="material-symbols-outlined text-base text-[#464555]">help</span>
          </button>

          {showHelp && (
            <div className="absolute right-0 mt-2 w-72 glass-card rounded-2xl p-4 shadow-xl border border-[#c7c4d8]/40 z-50">
              <h4 className="font-bold text-sm text-[#0b1c30] mb-2">FinTrack Assistant</h4>
              <p className="text-xs text-[#464555] mb-3">
                Need help categorizing transactions or setting up automatic monthly budgets?
              </p>
              <div className="space-y-1.5">
                <a
                  href="#faq"
                  onClick={(e) => { e.preventDefault(); alert('Connecting to FinTrack Support Chat...'); }}
                  className="block text-xs text-[#3525cd] font-semibold hover:underline"
                >
                  • How do I export CSV reports?
                </a>
                <a
                  href="#faq"
                  onClick={(e) => { e.preventDefault(); alert('Budget alert threshold is set at 80% and 95% by default.'); }}
                  className="block text-xs text-[#3525cd] font-semibold hover:underline"
                >
                  • How budget alerts work
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
