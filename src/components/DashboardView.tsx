import React, { useState } from 'react';
import { Transaction, TabType } from '../types';
import { formatMoney } from '../data/currencies';

interface DashboardViewProps {
  transactions: Transaction[];
  onNavigateToTab: (tab: TabType) => void;
  onOpenAddModal: (type?: 'income' | 'expense') => void;
  searchQuery: string;
  currency?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  onNavigateToTab,
  onOpenAddModal,
  searchQuery,
  currency = 'USD',
}) => {
  const [period, setPeriod] = useState<'W' | 'M' | 'Y'>('W');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Filter transactions based on global search if applicable
  const filteredTx = searchQuery
    ? transactions.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transactions;

  const recentTransactions = filteredTx.slice(0, 5);

  // Dynamic calculations from transactions
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalBalance = totalIncome - totalExpense;

  const weeklySpendingData = [
    { day: 'Mon', amount: totalExpense ? Math.round(totalExpense * 0.12) : 0, heightPct: 35 },
    { day: 'Tue', amount: totalExpense ? Math.round(totalExpense * 0.18) : 0, heightPct: 55 },
    { day: 'Wed', amount: totalExpense ? Math.round(totalExpense * 0.15) : 0, heightPct: 45 },
    { day: 'Thu', amount: totalExpense ? Math.round(totalExpense * 0.22) : 0, heightPct: 75 },
    { day: 'Fri', amount: totalExpense ? Math.round(totalExpense * 0.14) : 0, heightPct: 40 },
    { day: 'Sat', amount: totalExpense ? Math.round(totalExpense * 0.11) : 0, heightPct: 30 },
    { day: 'Sun', amount: totalExpense ? Math.round(totalExpense * 0.08) : 0, heightPct: 25 },
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Hero Stats Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="glass-card p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#3525cd]/5 rounded-full blur-2xl group-hover:bg-[#3525cd]/10 transition-all duration-500" />
          <div className="flex flex-col h-full justify-between">
            <div>
              <span className="text-[#464555] font-label-caps uppercase tracking-wider mb-2 block">
                Total Balance
              </span>
              <h2 className="font-numeric text-[32px] sm:text-[36px] font-bold text-[#3525cd] tracking-tight">
                {formatMoney(totalBalance, currency)}
              </h2>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[#006c49] font-medium text-xs sm:text-sm">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              <span>{transactions.length > 0 ? '+4.2% from last month' : 'Net balance across accounts'}</span>
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="glass-card p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
          <span className="text-[#464555] font-label-caps uppercase tracking-wider mb-2 block">
            Monthly Income
          </span>
          <h2 className="font-numeric text-2xl font-bold text-[#0b1c30]">
            {formatMoney(totalIncome, currency)}
          </h2>
          <div className="mt-4 w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006c49] h-full rounded-full transition-all duration-1000"
              style={{ width: totalIncome > 0 ? '100%' : '0%' }}
            />
          </div>
          <p className="text-xs text-[#464555] mt-2">
            {totalIncome > 0 ? 'Recorded income sources' : 'No income recorded yet'}
          </p>
        </div>

        {/* Monthly Expenses */}
        <div className="glass-card p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
          <span className="text-[#464555] font-label-caps uppercase tracking-wider mb-2 block">
            Monthly Expenses
          </span>
          <h2 className="font-numeric text-2xl font-bold text-[#0b1c30]">
            {formatMoney(totalExpense, currency)}
          </h2>
          <div className="mt-4 w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#950029] h-full rounded-full transition-all duration-1000"
              style={{ width: totalExpense > 0 ? '60%' : '0%' }}
            />
          </div>
          <p className="text-xs text-[#464555] mt-2">
            {totalExpense > 0 ? 'Total logged expenses' : 'No expenses logged yet'}
          </p>
        </div>
      </section>

      {/* Main Insights Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Monthly Spending Bar Chart Card */}
        <div className="lg:col-span-3 glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0b1c30]">Weekly Outflow Trend</h3>
              <p className="text-xs text-[#464555] mt-0.5">Average daily expense distribution</p>
            </div>
            <div className="flex gap-1.5 p-1 bg-[#eff4ff] rounded-xl border border-[#c7c4d8]/20">
              {(['W', 'M', 'Y'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    period === p
                      ? 'bg-white shadow-sm text-[#3525cd]'
                      : 'text-[#464555] hover:text-[#0b1c30]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Display */}
          <div className="h-60 w-full relative flex items-end justify-between px-4 pt-10 pb-2">
            {weeklySpendingData.map((item, idx) => {
              const isHovered = hoveredBar === idx;
              return (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full max-w-[36px] flex flex-col items-center justify-end h-44 relative">
                    {/* Tooltip on hover */}
                    <div
                      className={`absolute -top-9 bg-[#0b1c30] text-white text-[11px] font-numeric px-2 py-1 rounded-md shadow-md transition-all duration-200 pointer-events-none whitespace-nowrap z-10 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      {formatMoney(item.amount, currency)}
                    </div>
                    {/* Bar Pill */}
                    <div
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      style={{ height: `${item.amount > 0 ? item.heightPct : 8}%` }}
                      className={`w-full rounded-t-xl cursor-pointer transition-all duration-300 ${
                        idx === 3 || isHovered
                          ? 'bg-[#3525cd] shadow-md shadow-[#3525cd]/20'
                          : 'bg-[#3525cd]/20 hover:bg-[#3525cd]'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-label-caps text-[#464555] group-hover:text-[#3525cd] transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions List Card */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-[#0b1c30]">Recent Activity</h3>
            {recentTransactions.length > 0 && (
              <button
                onClick={() => onNavigateToTab('transactions')}
                className="text-[#3525cd] text-xs font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[320px] pr-1">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => onNavigateToTab('transactions')}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/80 transition-all cursor-pointer border border-transparent hover:border-[#c7c4d8]/30 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full ${tx.iconBg} ${tx.iconColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="material-symbols-outlined text-lg">{tx.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0b1c30] truncate group-hover:text-[#3525cd] transition-colors">
                        {tx.title}
                      </p>
                      <p className="text-[10px] text-[#464555] font-label-caps uppercase truncate">
                        {tx.category.split('&')[0]} • {tx.date}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-numeric text-sm font-bold flex-shrink-0 ml-2 ${
                      tx.amount > 0 ? 'text-[#006c49]' : 'text-[#0b1c30]'
                    }`}
                  >
                    {formatMoney(tx.amount, currency)}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#c7c4d8]/40 rounded-2xl">
                <span className="material-symbols-outlined text-3xl text-[#777587] mb-2">receipt_long</span>
                <p className="font-bold text-sm text-[#0b1c30]">No transactions yet</p>
                <p className="text-xs text-[#464555] mt-1 mb-4">Add your first income or expense transaction to see it here.</p>
                <button
                  onClick={() => onOpenAddModal('expense')}
                  className="px-4 py-2 rounded-full bg-[#3525cd] text-white font-bold text-xs hover:bg-[#2b1cb8]"
                >
                  + Add First Transaction
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Welcome Banner */}
        <div className="bg-[#eff4ff] border border-[#3525cd]/20 p-6 rounded-3xl flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-bold text-[#0b1c30]">Welcome to Finzab</h4>
            <p className="text-xs text-[#464555] mt-1 leading-relaxed">
              Track your daily cash flow, manage category budget limits, and select from 50+ global currencies in Settings.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onOpenAddModal('income')}
            className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-[#6cf8bb]/10 transition-all duration-300 group border-none shadow-sm cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-[#6cf8bb]/30 text-[#006c49] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-3xl">add_circle</span>
            </div>
            <span className="font-bold text-sm text-[#0b1c30]">Add Income</span>
          </button>

          <button
            onClick={() => onOpenAddModal('expense')}
            className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-[#ffdad6]/20 transition-all duration-300 group border-none shadow-sm cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-[#ffdada]/40 text-[#950029] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-3xl">remove_circle</span>
            </div>
            <span className="font-bold text-sm text-[#0b1c30]">Add Expense</span>
          </button>
        </div>
      </section>
    </div>
  );
};
