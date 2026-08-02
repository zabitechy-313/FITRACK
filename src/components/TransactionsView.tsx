import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatMoney } from '../data/currencies';

interface TransactionsViewProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currency?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  searchQuery,
  setSearchQuery,
  currency = 'USD',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [dateRange, setDateRange] = useState<string>('Oct 1, 2023 - Oct 31, 2023');

  // Categories list
  const categories = [
    'All Categories',
    'Technology & Electronics',
    'Income & Wages',
    'Dining & Entertainment',
    'Housing & Bills',
    'Groceries',
    'Transportation',
    'Shopping',
  ];

  // Filtering & Sorting logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = tx.title.toLowerCase().includes(q);
          const matchesCategory = tx.category.toLowerCase().includes(q);
          const matchesAmount = tx.amount.toString().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesAmount) return false;
        }
        // Category
        if (selectedCategory !== 'All Categories' && tx.category !== selectedCategory) {
          return false;
        }
        // Type
        if (selectedType === 'income' && tx.type !== 'income') return false;
        if (selectedType === 'expense' && tx.type !== 'expense') return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        if (sortBy === 'oldest') return a.id.localeCompare(b.id);
        if (sortBy === 'highest') return Math.abs(b.amount) - Math.abs(a.amount);
        if (sortBy === 'lowest') return Math.abs(a.amount) - Math.abs(b.amount);
        return 0;
      });
  }, [transactions, searchQuery, selectedCategory, selectedType, sortBy]);

  const displayedTransactions = filteredTransactions.slice(0, visibleCount);

  // Export CSV helper
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Date', 'Time', 'Amount', 'Type'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      `"${tx.title.replace(/"/g, '""')}"`,
      `"${tx.category}"`,
      tx.date,
      tx.time,
      tx.amount,
      tx.type,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fintrack_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedType('all');
    setSortBy('newest');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">Transaction History</h2>
          <p className="text-[#464555] text-sm mt-1">
            Review and manage your financial activity across all connected accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c7c4d8] text-[#3525cd] font-semibold text-sm hover:bg-[#3525cd]/5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3525cd] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#3525cd]/25 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Glassmorphic Filters Section */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-label-caps text-[#464555] uppercase tracking-wider">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#eff4ff] border-none rounded-xl py-2 px-3.5 text-xs sm:text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 cursor-pointer outline-none w-full"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-label-caps text-[#464555] uppercase tracking-wider">
            Date Range
          </label>
          <div className="flex items-center bg-[#eff4ff] rounded-xl px-3.5 py-2 w-full">
            <span className="material-symbols-outlined text-base text-[#777587] mr-2 flex-shrink-0">
              calendar_today
            </span>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none p-0 text-xs sm:text-sm font-medium text-[#0b1c30] focus:ring-0 w-full outline-none"
            />
          </div>
        </div>

        {/* Type Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-label-caps text-[#464555] uppercase tracking-wider">
            Type
          </label>
          <div className="flex p-1 bg-[#eff4ff] rounded-xl w-full">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  selectedType === t
                    ? 'bg-white shadow-sm text-[#3525cd]'
                    : 'text-[#464555] hover:text-[#0b1c30]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[11px] font-label-caps text-[#464555] uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#eff4ff] border-none rounded-xl py-2 px-3 text-xs sm:text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 cursor-pointer outline-none w-full"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            title="Reset filters"
            className="mt-6 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#d3e4fe] text-[#3525cd] hover:bg-[#3525cd] hover:text-white transition-all duration-300 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">filter_list_off</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      {displayedTransactions.length > 0 ? (
        <div className="space-y-3.5">
          {displayedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 group hover:shadow-xl hover:shadow-[#3525cd]/5 transition-all duration-300 transform hover:-translate-y-0.5 border border-[#c7c4d8]/30 hover:border-[#3525cd]/40"
            >
              <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto flex-1">
                {/* Category Icon Badge */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${tx.iconBg} ${tx.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">{tx.icon}</span>
                </div>

                {/* Title & Category */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#0b1c30] truncate text-sm sm:text-base">{tx.title}</h4>
                  <p className="text-[11px] sm:text-xs text-[#464555] font-label-caps uppercase tracking-wide truncate">
                    {tx.category} • <span className="sm:hidden">{tx.date}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4">
                {/* Date & Time (Desktop) */}
                <div className="text-right hidden sm:block flex-shrink-0">
                  <p className="font-numeric text-sm font-medium text-[#0b1c30]">{tx.date}</p>
                  <p className="text-xs text-[#464555]">{tx.time}</p>
                </div>

                {/* Amount */}
                <div className="text-left sm:text-right flex-shrink-0">
                  <span
                    className={`font-numeric text-lg sm:text-xl font-bold ${
                      tx.amount > 0 ? 'text-[#006c49]' : 'text-[#0b1c30]'
                    }`}
                  >
                    {formatMoney(tx.amount, currency)}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditTransaction(tx)}
                    title="Edit Transaction"
                    className="p-1.5 sm:p-2 rounded-full hover:bg-[#dce9ff] text-[#464555] hover:text-[#3525cd] transition-all"
                  >
                    <span className="material-symbols-outlined text-base sm:text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    title="Delete Transaction"
                    className="p-1.5 sm:p-2 rounded-full hover:bg-[#ffdad6] text-[#ba1a1a] transition-all"
                  >
                    <span className="material-symbols-outlined text-base sm:text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Load More / Pagination */}
          <div className="mt-10 flex flex-col items-center gap-3 pt-4">
            {visibleCount < filteredTransactions.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-8 py-3 rounded-full border border-[#3525cd]/20 text-[#3525cd] font-bold text-sm hover:bg-[#3525cd]/5 active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">expand_more</span>
                <span>Load More Transactions</span>
              </button>
            )}
            <p className="text-[#464555] text-xs font-medium">
              Showing 1-{displayedTransactions.length} of {filteredTransactions.length} transactions
            </p>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300 glass-card rounded-3xl p-8">
          <div className="w-20 h-20 rounded-full bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl">search_off</span>
          </div>
          <h3 className="text-xl font-bold text-[#0b1c30] mb-2">No transactions found</h3>
          <p className="text-[#464555] max-w-md text-sm mb-6">
            We couldn't find any transactions matching your current search query or filters. Try adjusting your search criteria or dates.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-[#3525cd] text-white rounded-full font-bold text-sm hover:bg-[#3525cd]/90 transition-all shadow-md"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
