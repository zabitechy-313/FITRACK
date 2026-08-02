import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { BudgetView } from './components/BudgetView';
import { SettingsView } from './components/SettingsView';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { AuthPage } from './components/AuthPage';
import { TabType, Transaction, BudgetCategoryItem, UserProfile } from './types';
import {
  initialTransactions,
  initialBudgetCategories,
  initialUserProfile,
  freshUserProfile,
} from './data/mockData';
import { getCurrencyByCode } from './data/currencies';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication State - Defaults to false on first visit so Login Page appears first
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('fintrack_is_logged_in');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Transactions State - Defaults to empty array for clean Financial Insights
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('fintrack_transactions');
      return saved !== null ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('fintrack_budgets');
      return saved !== null ? JSON.parse(saved) : initialBudgetCategories;
    } catch {
      return initialBudgetCategories;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fintrack_user_profile');
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fintrack_is_logged_in', JSON.stringify(isLoggedIn));
    } catch (e) {
      console.error('Failed to save auth state to localStorage', e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('fintrack_budgets', JSON.stringify(budgetCategories));
    } catch (e) {
      console.error('Failed to save budgets to localStorage', e);
    }
  }, [budgetCategories]);

  useEffect(() => {
    try {
      localStorage.setItem('fintrack_user_profile', JSON.stringify(userProfile));

      // Also persist user profile in email-indexed map & registered users list
      if (userProfile && userProfile.email) {
        const cleanEmail = userProfile.email.trim().toLowerCase();

        // 1. Save in email-indexed map
        const savedMap = localStorage.getItem('fintrack_profiles_by_email');
        const profilesMap = savedMap ? JSON.parse(savedMap) : {};
        profilesMap[cleanEmail] = userProfile;
        localStorage.setItem('fintrack_profiles_by_email', JSON.stringify(profilesMap));

        // 2. Sync back to fintrack_registered_users if present
        const savedUsers = localStorage.getItem('fintrack_registered_users');
        if (savedUsers) {
          const registered = JSON.parse(savedUsers);
          const updated = registered.map((u: any) => {
            if (u.email && u.email.trim().toLowerCase() === cleanEmail) {
              return {
                ...u,
                name: userProfile.name,
                avatar: userProfile.avatar,
              };
            }
            return u;
          });
          localStorage.setItem('fintrack_registered_users', JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, [userProfile]);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [modalDefaultType, setModalDefaultType] = useState<'income' | 'expense'>('expense');

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudgetCategory, setEditingBudgetCategory] = useState<BudgetCategoryItem | null>(null);

  // Auth Handlers
  const handleLoginSuccess = (profileData: Partial<UserProfile>) => {
    const cleanEmail = profileData.email?.trim().toLowerCase();

    // Look up existing stored profile for this email
    let savedProfileForUser: UserProfile | null = null;
    if (cleanEmail) {
      try {
        const savedMap = localStorage.getItem('fintrack_profiles_by_email');
        if (savedMap) {
          const profilesMap = JSON.parse(savedMap);
          if (profilesMap[cleanEmail]) {
            savedProfileForUser = profilesMap[cleanEmail];
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    setUserProfile((prev) => {
      const base =
        savedProfileForUser ||
        (prev.email?.trim().toLowerCase() === cleanEmail ? prev : initialUserProfile);

      const avatar = profileData.avatar || base.avatar || initialUserProfile.avatar;

      return {
        ...base,
        ...profileData,
        avatar,
      };
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsLoggedIn(false);
      localStorage.setItem('fintrack_is_logged_in', JSON.stringify(false));
    }
  };

  // Transaction Handlers
  const handleOpenAddTxModal = (type: 'income' | 'expense' = 'expense') => {
    setEditingTx(null);
    setModalDefaultType(type);
    setIsTxModalOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const handleDeleteTx = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSaveTx = (txData: Partial<Transaction>) => {
    if (editingTx) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTx.id ? ({ ...t, ...txData } as Transaction) : t))
      );
    } else {
      setTransactions((prev) => [txData as Transaction, ...prev]);
    }
  };

  // Budget Category Handlers
  const handleOpenBudgetModal = (editingItem?: BudgetCategoryItem) => {
    setEditingBudgetCategory(editingItem || null);
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = (categoryItem: BudgetCategoryItem) => {
    if (editingBudgetCategory) {
      setBudgetCategories((prev) =>
        prev.map((b) => (b.id === editingBudgetCategory.id ? categoryItem : b))
      );
    } else {
      setBudgetCategories((prev) => [...prev, categoryItem]);
    }
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget category?')) {
      setBudgetCategories((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleResetData = (mode: 'fresh' | 'demo') => {
    if (mode === 'fresh') {
      const freshUser = {
        ...freshUserProfile,
        currency: userProfile.currency || 'USD',
      };
      setTransactions([]);
      setBudgetCategories([]);
      setUserProfile(freshUser);
      localStorage.setItem('fintrack_transactions', JSON.stringify([]));
      localStorage.setItem('fintrack_budgets', JSON.stringify([]));
      localStorage.setItem('fintrack_user_profile', JSON.stringify(freshUser));
    } else {
      setTransactions(initialTransactions);
      setBudgetCategories(initialBudgetCategories);
      setUserProfile(initialUserProfile);
      localStorage.setItem('fintrack_transactions', JSON.stringify(initialTransactions));
      localStorage.setItem('fintrack_budgets', JSON.stringify(initialBudgetCategories));
      localStorage.setItem('fintrack_user_profile', JSON.stringify(initialUserProfile));
    }
  };

  // IF NOT LOGGED IN -> Show Full Screen Login / Registration Page First
  if (!isLoggedIn) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const currentCurrency = userProfile.currency || 'USD';
  const currencyObj = getCurrencyByCode(currentCurrency);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#3525cd]/20 overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={userProfile}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoggedIn(false)}
        onLogout={handleLogout}
      />

      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenAddModal={() => {
          if (activeTab === 'budget') {
            handleOpenBudgetModal();
          } else {
            handleOpenAddTxModal('expense');
          }
        }}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoggedIn(false)}
        user={userProfile}
      />

      {/* Main Canvas View */}
      <main className="lg:ml-64 pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 pb-28 lg:pb-12 min-h-screen max-w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                transactions={transactions}
                onNavigateToTab={setActiveTab}
                onOpenAddModal={handleOpenAddTxModal}
                searchQuery={searchQuery}
                currency={currentCurrency}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                onOpenAddModal={() => handleOpenAddTxModal('expense')}
                onEditTransaction={handleEditTx}
                onDeleteTransaction={handleDeleteTx}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currency={currentCurrency}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView transactions={transactions} currency={currentCurrency} />
            )}

            {activeTab === 'budget' && (
              <BudgetView
                categories={budgetCategories}
                onOpenBudgetModal={handleOpenBudgetModal}
                onDeleteBudget={handleDeleteBudget}
                currency={currentCurrency}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                user={userProfile}
                setUser={setUserProfile}
                onResetData={handleResetData}
                transactionCount={transactions.length}
                isLoggedIn={isLoggedIn}
                onOpenLogin={() => setIsLoggedIn(false)}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTx}
        initialData={editingTx}
        defaultType={modalDefaultType}
        currencySymbol={currencyObj.symbol}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSaveBudget={handleSaveBudget}
        initialData={editingBudgetCategory}
        currencySymbol={currencyObj.symbol}
      />
    </div>
  );
}
