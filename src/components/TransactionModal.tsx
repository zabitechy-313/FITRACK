import React, { useState, useEffect } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Partial<Transaction>) => void;
  initialData?: Transaction | null;
  defaultType?: TransactionType;
  currencySymbol?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultType = 'expense',
  currencySymbol = '$',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Dining & Entertainment');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [date, setDate] = useState('Oct 28, 2023');
  const [time, setTime] = useState('10:45 AM');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setAmount(Math.abs(initialData.amount).toString());
      setType(initialData.type);
      setDate(initialData.date);
      setTime(initialData.time);
    } else {
      setTitle('');
      setCategory('Dining & Entertainment');
      setAmount('');
      setType(defaultType);
      setDate('Oct 28, 2023');
      setTime('10:45 AM');
    }
  }, [initialData, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const numAmt = parseFloat(amount);
    const finalAmount = type === 'expense' ? -Math.abs(numAmt) : Math.abs(numAmt);

    // Pick appropriate icon based on category
    let icon = 'receipt_long';
    let iconBg = 'bg-blue-100';
    let iconColor = 'text-blue-600';

    if (category === 'Technology & Electronics') {
      icon = 'shopping_bag';
      iconBg = 'bg-blue-100';
      iconColor = 'text-blue-600';
    } else if (category === 'Income & Wages') {
      icon = 'payments';
      iconBg = 'bg-emerald-100';
      iconColor = 'text-emerald-600';
    } else if (category === 'Dining & Entertainment') {
      icon = 'restaurant';
      iconBg = 'bg-purple-100';
      iconColor = 'text-purple-600';
    } else if (category === 'Housing & Bills') {
      icon = 'bolt';
      iconBg = 'bg-amber-100';
      iconColor = 'text-amber-600';
    } else if (category === 'Groceries') {
      icon = 'shopping_cart';
      iconBg = 'bg-emerald-100';
      iconColor = 'text-emerald-600';
    } else if (category === 'Transportation') {
      icon = 'directions_car';
      iconBg = 'bg-blue-100';
      iconColor = 'text-blue-600';
    } else if (category === 'Shopping') {
      icon = 'shopping_bag';
      iconBg = 'bg-rose-100';
      iconColor = 'text-rose-600';
    }

    onSave({
      id: initialData ? initialData.id : `tx-${Date.now()}`,
      title,
      category,
      amount: finalAmount,
      type,
      date,
      time,
      icon,
      iconBg,
      iconColor,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0b1c30]/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="glass-card w-full max-w-lg rounded-[32px] p-6 md:p-8 shadow-2xl relative z-10 border border-white/40 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0b1c30]">
              {initialData ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
            <p className="text-xs text-[#464555] mt-0.5">Record income or expense activity</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#eff4ff] flex items-center justify-center transition-all text-[#464555]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div className="flex p-1 bg-[#eff4ff] rounded-2xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-white text-[#950029] shadow-sm'
                  : 'text-[#464555] hover:text-[#0b1c30]'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-white text-[#006c49] shadow-sm'
                  : 'text-[#464555] hover:text-[#0b1c30]'
              }`}
            >
              Income (+)
            </button>
          </div>

          <div>
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
              Title / Merchant Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apple Store, Acme Salary, Uber"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#eff4ff] border-none rounded-xl py-3 px-4 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full bg-[#eff4ff] border-none rounded-xl py-3 px-3 text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 cursor-pointer outline-none"
              >
                <option value="Technology & Electronics">Technology & Electronics</option>
                <option value="Income & Wages">Income & Wages</option>
                <option value="Dining & Entertainment">Dining & Entertainment</option>
                <option value="Housing & Bills">Housing & Bills</option>
                <option value="Groceries">Groceries</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Amount ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#464555] text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm font-numeric text-[#0b1c30] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#eff4ff] border-none rounded-xl py-3 px-4 text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#eff4ff] border-none rounded-xl py-3 px-4 text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-[#464555] hover:bg-[#eff4ff] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#3525cd] text-white hover:opacity-90 transition-all shadow-lg shadow-[#3525cd]/20"
            >
              {initialData ? 'Save Changes' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
