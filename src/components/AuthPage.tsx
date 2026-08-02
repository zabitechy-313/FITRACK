import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface AuthPageProps {
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
}

interface RegisteredUser {
  name: string;
  email: string;
  passwordHash: string; // stored locally
  avatar?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper to retrieve registered accounts from localStorage
  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      const saved = localStorage.getItem('fintrack_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Helper to retrieve previously saved avatar for a given email address
  const getSavedAvatarForEmail = (emailStr: string, defaultAvatar: string): string => {
    const clean = emailStr.trim().toLowerCase();
    try {
      // 1. Check fintrack_profiles_by_email
      const savedMap = localStorage.getItem('fintrack_profiles_by_email');
      if (savedMap) {
        const profilesMap = JSON.parse(savedMap);
        if (profilesMap[clean]?.avatar) {
          return profilesMap[clean].avatar;
        }
      }

      // 2. Check fintrack_registered_users
      const registered = getRegisteredUsers();
      const matched = registered.find((u) => u.email.toLowerCase() === clean);
      if (matched?.avatar) {
        return matched.avatar;
      }

      // 3. Check current fintrack_user_profile
      const current = localStorage.getItem('fintrack_user_profile');
      if (current) {
        const parsed = JSON.parse(current);
        if (parsed.email?.toLowerCase() === clean && parsed.avatar) {
          return parsed.avatar;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultAvatar;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    if (isRegister) {
      // REGISTRATION FLOW
      if (!name.trim()) {
        setErrorMsg('Please enter your full name for registration.');
        return;
      }

      const existingUsers = getRegisteredUsers();
      const alreadyExists = existingUsers.some((u) => u.email.toLowerCase() === cleanEmail);

      if (alreadyExists) {
        setErrorMsg('An account with this email already exists. Please switch to Sign In.');
        return;
      }

      // Save new account with default avatar
      const newUser: RegisteredUser = {
        name: name.trim(),
        email: cleanEmail,
        passwordHash: password,
        avatar: defaultAvatar,
      };

      try {
        localStorage.setItem(
          'fintrack_registered_users',
          JSON.stringify([...existingUsers, newUser])
        );
      } catch (err) {
        console.error('Failed to save account', err);
      }

      // Show success message and switch to Sign In tab with prefilled email
      setSuccessMsg('Account registered successfully! Please enter your password to sign in.');
      setIsRegister(false);
      setPassword('');
      return;
    }

    // LOGIN FLOW - Strictly require account registration
    const registeredUsers = getRegisteredUsers();
    const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (matchedUser) {
      if (matchedUser.passwordHash !== password) {
        setErrorMsg('Incorrect password. Please try again.');
        return;
      }

      const initials =
        matchedUser.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'US';

      const avatar = getSavedAvatarForEmail(matchedUser.email, matchedUser.avatar || defaultAvatar);

      onLoginSuccess({
        name: matchedUser.name,
        email: matchedUser.email,
        initials,
        avatar,
      });
      return;
    }

    // Support pre-configured demo accounts
    if (cleanEmail === 'alex.morgan@example.com' || cleanEmail === 'sarah.chen@example.com') {
      const demoName = cleanEmail === 'alex.morgan@example.com' ? 'Alex Morgan' : 'Sarah Chen';
      const fallbackImg =
        cleanEmail === 'alex.morgan@example.com'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80';

      const initials = demoName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const avatar = getSavedAvatarForEmail(cleanEmail, fallbackImg);

      onLoginSuccess({
        name: demoName,
        email: cleanEmail,
        initials,
        avatar,
      });
      return;
    }

    // Unregistered account attempt -> Block login and instruct user to register first
    setErrorMsg('No account found with this email address. Please click "Create Account" to register first.');
  };

  const handleDemoLogin = (demoName: string, demoEmail: string, fallbackAvatar: string) => {
    const initials = demoName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const avatar = getSavedAvatarForEmail(demoEmail, fallbackAvatar);

    onLoginSuccess({
      name: demoName,
      email: demoEmail,
      initials,
      avatar,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-[#3525cd]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-[#006c49]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="glass-card w-full max-w-md rounded-[32px] p-6 sm:p-10 shadow-2xl relative z-10 border border-white/80 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="xl" showText={true} className="mb-2" />
          <p className="text-xs font-label-caps uppercase tracking-widest text-[#464555] font-bold">
            Personal Wealth & Budget Manager
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#eff4ff] p-1 rounded-2xl mb-6 border border-[#c7c4d8]/20">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              !isRegister
                ? 'bg-white text-[#3525cd] shadow-sm'
                : 'text-[#464555] hover:text-[#0b1c30]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isRegister
                ? 'bg-white text-[#3525cd] shadow-sm'
                : 'text-[#464555] hover:text-[#0b1c30]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 text-[#006c49] border border-emerald-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-[#ba1a1a] border border-red-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] text-lg">
                  person
                </span>
                <input
                  type="text"
                  required={isRegister}
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm text-[#0b1c30] outline-none font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] text-lg">
                mail
              </span>
              <input
                type="email"
                required
                placeholder="alex.morgan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm text-[#0b1c30] outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] text-lg">
                lock
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm text-[#0b1c30] outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#3525cd] text-white hover:bg-[#2b1cb8] transition-all shadow-lg shadow-[#3525cd]/25 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            <span>{isRegister ? 'Register Account' : 'Sign In to Dashboard'}</span>
            <span className="material-symbols-outlined text-base">
              {isRegister ? 'person_add' : 'arrow_forward'}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#c7c4d8]/30" />
          </div>
          <span className="relative bg-[#f8f9ff] px-3 text-[10px] uppercase font-bold text-[#777587] tracking-wider">
            Or Demo Account Quick Login
          </span>
        </div>

        {/* Quick Demo Options */}
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
                <p className="text-[10px] text-[#464555]">Pro Plan • Sample Account</p>
              </div>
            </div>
            <span className="text-xs text-[#3525cd] font-bold group-hover:translate-x-0.5 transition-transform">
              Sign In &rarr;
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
                <p className="text-[10px] text-[#464555]">Starter Plan • Sample Account</p>
              </div>
            </div>
            <span className="text-xs text-[#3525cd] font-bold group-hover:translate-x-0.5 transition-transform">
              Sign In &rarr;
            </span>
          </button>
        </div>

        <p className="text-center text-[11px] text-[#777587] mt-6">
          Protected by FinTrack Security. Your data remains stored locally in your browser.
        </p>
      </div>
    </div>
  );
};
