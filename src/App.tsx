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

  // Persistent States from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('fintrack_transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('fintrack_budgets');
      return saved ? JSON.parse(saved) : initialBudgetCategories;
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
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, [userProfile]);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [modalDefaultType, setModalDefaultType] = useState<'income' | 'expense'>('expense');

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Handlers
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

  const handleAddBudget = (newCat: BudgetCategoryItem) => {
    setBudgetCategories((prev) => [...prev, newCat]);
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
      />

      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenAddModal={() => {
          if (activeTab === 'budget') {
            setIsBudgetModalOpen(true);
          } else {
            handleOpenAddTxModal('expense');
          }
        }}
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

            {activeTab === 'analytics' && <AnalyticsView currency={currentCurrency} />}

            {activeTab === 'budget' && (
              <BudgetView
                categories={budgetCategories}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                currency={currentCurrency}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                user={userProfile}
                setUser={setUserProfile}
                onResetData={handleResetData}
                transactionCount={transactions.length}
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
        onAddBudget={handleAddBudget}
        currencySymbol={currencyObj.symbol}
      />
    </div>
  );
}
