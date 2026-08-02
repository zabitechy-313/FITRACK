import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { ALL_CURRENCIES, getCurrencyByCode } from '../data/currencies';

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onResetData: (mode: 'fresh' | 'demo') => void;
  transactionCount: number;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  setUser,
  onResetData,
  transactionCount,
}) => {
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user.avatar]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCurrency = getCurrencyByCode(user.currency || 'USD');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image file smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUser((prev) => ({
          ...prev,
          avatar: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    setUser((prev) => ({
      ...prev,
      avatar: url,
    }));
    setShowAvatarPresets(false);
  };

  const handleRemoveAvatar = () => {
    setUser((prev) => ({
      ...prev,
      avatar: '',
    }));
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setUser((prev) => ({
        ...prev,
        avatar: customAvatarUrl.trim(),
      }));
      setCustomAvatarUrl('');
      setShowAvatarPresets(false);
    }
  };

  const handleConfirmReset = () => {
    onResetData('fresh');
    setShowConfirmReset(false);
    setResetMessage('All data removed! Your app is now set up like a fresh new user.');
    setTimeout(() => setResetMessage(null), 4000);
  };

  const handleLoadDemoData = () => {
    onResetData('demo');
    setResetMessage('Sample demo data loaded successfully.');
    setTimeout(() => setResetMessage(null), 4000);
  };

  // Helper to compute initials when name changes
  const handleNameChange = (newName: string) => {
    const parts = newName.trim().split(' ');
    let initials = 'NU';
    if (parts.length >= 2) {
      initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
    setUser({
      ...user,
      name: newName,
      initials,
    });
  };

  return (
    <div className="space-y-8 max-w-[900px] mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-[#0b1c30]">Account & App Settings</h2>
        <p className="text-[#464555] text-sm mt-1">
          Customize profile picture, preferred currency, notifications, and manage data.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#6cf8bb]/30 border border-[#006c49]/30 text-[#006c49] text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span>Your settings have been saved successfully!</span>
        </div>
      )}

      {resetMessage && (
        <div className="p-4 rounded-2xl bg-[#3525cd]/10 border border-[#3525cd]/30 text-[#3525cd] text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined">info</span>
          <span>{resetMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture & Personal Details */}
        <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd]">account_circle</span>
            <span>Profile & Photo</span>
          </h3>

          {/* Profile Picture Uploader */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#c7c4d8]/20">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#3525cd] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold overflow-hidden shadow-md ring-4 ring-[#eff4ff] relative flex-shrink-0">
                {user.avatar && !imgError ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover object-center rounded-full block"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="uppercase font-bold tracking-wider">{user.initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#3525cd] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                title="Change Photo"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h4 className="font-bold text-[#0b1c30]">Profile Photo</h4>
                <p className="text-xs text-[#464555] mt-0.5">
                  Upload your own photo, choose from preset avatars, or paste an image URL.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3525cd] text-white font-semibold text-xs hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">upload</span>
                  <span>Upload Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#eff4ff] text-[#3525cd] font-semibold text-xs hover:bg-[#dce9ff] transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">face</span>
                  <span>Choose Preset</span>
                </button>

                {user.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3.5 py-1.5 rounded-xl bg-[#ffdad6]/60 text-[#ba1a1a] font-semibold text-xs hover:bg-[#ffdad6] transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {/* Preset Avatars Drawer */}
              {showAvatarPresets && (
                <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#c7c4d8]/30 space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs font-bold text-[#0b1c30]">Select Avatar Preset:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(url)}
                        className={`w-11 h-11 rounded-full overflow-hidden ring-2 transition-all transform hover:scale-105 flex-shrink-0 ${
                          user.avatar === url
                            ? 'ring-[#3525cd] ring-offset-2'
                            : 'ring-transparent hover:ring-[#3525cd]/50'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Preset ${idx + 1}`}
                          className="w-full h-full object-cover object-center rounded-full block"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#c7c4d8]/20 flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className="flex-1 bg-white border-none rounded-xl px-3 py-1.5 text-xs text-[#0b1c30] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 bg-[#3525cd] text-white rounded-xl text-xs font-bold hover:bg-[#2b1cb8]"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#eff4ff] border-none rounded-xl py-2.5 px-4 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full bg-[#eff4ff] border-none rounded-xl py-2.5 px-4 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Preferences */}
        <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3525cd]">payments</span>
              <span>Currency & Preferences</span>
            </h3>
            <span className="px-3 py-1 bg-[#3525cd]/10 text-[#3525cd] font-bold text-xs rounded-full">
              {ALL_CURRENCIES.length}+ Global Currencies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Primary Currency Symbol ({currentCurrency.symbol})
              </label>
              <select
                value={user.currency || 'USD'}
                onChange={(e) => setUser({ ...user, currency: e.target.value })}
                className="w-full bg-[#eff4ff] border-none rounded-xl py-2.5 px-4 text-sm font-medium text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 cursor-pointer outline-none"
              >
                {ALL_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#464555] mt-1">
                All financial figures and balances across the app will update to{' '}
                <span className="font-bold text-[#3525cd]">{currentCurrency.code} ({currentCurrency.symbol})</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Subscription Tier
              </label>
              <input
                type="text"
                disabled
                value={user.plan}
                className="w-full bg-[#eff4ff]/60 border-none rounded-xl py-2.5 px-4 text-sm text-[#777587] font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Toggles */}
        <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd]">notifications</span>
            <span>Alert Controls</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#eff4ff] cursor-pointer">
              <div>
                <p className="font-bold text-sm text-[#0b1c30]">Smart Budget Alert Thresholds</p>
                <p className="text-xs text-[#464555]">Notify me when spending reaches 80% and 95% of category limits</p>
              </div>
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#3525cd] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#eff4ff] cursor-pointer">
              <div>
                <p className="font-bold text-sm text-[#0b1c30]">Weekly Summary Digest</p>
                <p className="text-xs text-[#464555]">Get a weekly breakdown of cash flow and savings progress</p>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-5 h-5 accent-[#3525cd] rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#3525cd] text-white font-bold text-sm hover:shadow-lg hover:shadow-[#3525cd]/25 active:scale-95 transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data & Start Fresh */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border-2 border-[#ba1a1a]/20 bg-[#ffdad6]/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#ba1a1a] flex items-center gap-2">
            <span className="material-symbols-outlined">restart_alt</span>
            <span>Data Reset & Fresh Start</span>
          </h3>
          <span className="text-xs font-bold text-[#464555]">
            {transactionCount} transactions logged
          </span>
        </div>

        <p className="text-xs text-[#464555] leading-relaxed">
          Remove all existing transactions, custom budgets, and sample records to start completely fresh as a new user, or restore the original demo dataset.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#ba1a1a] text-white font-bold text-xs hover:bg-[#950029] active:scale-95 transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">delete_sweep</span>
            <span>Remove All Data (New User)</span>
          </button>

          <button
            type="button"
            onClick={handleLoadDemoData}
            className="px-5 py-2.5 rounded-2xl bg-[#eff4ff] border border-[#c7c4d8]/40 text-[#0b1c30] font-bold text-xs hover:bg-[#dce9ff] active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">dataset</span>
            <span>Load Sample Demo Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">Are you sure you want to reset all data?</h3>
              <p className="text-xs text-[#464555] mt-1 leading-relaxed">
                This will delete all transaction records, custom budget categories, and clear profile info. You will get a clean, blank slate for a brand new user setup.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-xs font-bold hover:bg-[#dce9ff]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#950029] shadow-md"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
