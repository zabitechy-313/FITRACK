import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const userName = name || email.split('@')[0] || 'User';
    const initials = userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'US';

    onLoginSuccess({
      name: userName,
      email: email,
      initials: initials,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    onClose();
  };

  const handleDemoLogin = (demoName: string, demoEmail: string, avatar: string) => {
    const initials = demoName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    onLoginSuccess({
      name: demoName,
      email: demoEmail,
      initials,
      avatar,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0b1c30]/50 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Card */}
      <div className="glass-card w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 border border-white/60 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0b1c30]">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-[#464555]">Sign in to sync your FinTrack data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#eff4ff] flex items-center justify-center transition-all text-[#464555]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm text-[#0b1c30] outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="alex.morgan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm text-[#0b1c30] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm text-[#0b1c30] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#3525cd] text-white hover:bg-[#2b1cb8] transition-all shadow-lg shadow-[#3525cd]/25 active:scale-[0.98] mt-2"
          >
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#c7c4d8]/30" />
          </div>
          <span className="relative bg-white/80 px-3 text-[11px] uppercase font-bold text-[#777587]">
            Or Quick Demo Login
          </span>
        </div>

        {/* Demo Accounts */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() =>
              handleDemoLogin(
                'Alex Morgan',
                'alex.morgan@example.com',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              )
            }
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#eff4ff] hover:bg-[#e0ebff] transition-all text-left border border-[#3525cd]/10 group"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Alex Morgan"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-[#0b1c30]">Alex Morgan</p>
                <p className="text-[10px] text-[#464555]">Pro Plan • Primary Account</p>
              </div>
            </div>
            <span className="text-xs text-[#3525cd] font-bold group-hover:translate-x-0.5 transition-transform">
              Select &rarr;
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleDemoLogin(
                'Sarah Chen',
                'sarah.chen@example.com',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
              )
            }
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#eff4ff] hover:bg-[#e0ebff] transition-all text-left border border-[#3525cd]/10 group"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                alt="Sarah Chen"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-[#0b1c30]">Sarah Chen</p>
                <p className="text-[10px] text-[#464555]">Starter Plan • Personal Account</p>
              </div>
            </div>
            <span className="text-xs text-[#3525cd] font-bold group-hover:translate-x-0.5 transition-transform">
              Select &rarr;
            </span>
          </button>
        </div>

        {/* Footer Toggle */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-semibold text-[#3525cd] hover:underline"
          >
            {isRegister
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
