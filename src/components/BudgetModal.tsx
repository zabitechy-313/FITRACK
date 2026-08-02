import React, { useState, useEffect } from 'react';
import { BudgetCategoryItem, TransactionCategory } from '../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBudget: (category: BudgetCategoryItem) => void;
  initialData?: BudgetCategoryItem | null;
  currencySymbol?: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSaveBudget,
  initialData,
  currencySymbol = '$',
}) => {
  const [name, setName] = useState('Groceries & Dining');
  const [amount, setAmount] = useState('800');
  const [spent, setSpent] = useState('0');
  const [enableAlert, setEnableAlert] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(initialData.allocated.toString());
      setSpent((initialData.spent || 0).toString());
    } else {
      setName('Groceries & Dining');
      setAmount('800');
      setSpent('0');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const allocated = parseFloat(amount) || 0;
    const spentAmount = parseFloat(spent) || 0;

    const budgetItem: BudgetCategoryItem = {
      id: initialData ? initialData.id : `bgt-${Date.now()}`,
      name,
      category: 'Other' as TransactionCategory,
      allocated,
      spent: spentAmount,
      icon: initialData?.icon || 'payments',
      color: initialData?.color || '#3525cd',
      containerBg: initialData?.containerBg || 'bg-indigo-100',
    };

    onSaveBudget(budgetItem);
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
              {initialData ? 'Edit Budget Category' : 'Set New Budget'}
            </h3>
            <p className="text-xs text-[#464555] mt-0.5">
              Define spending limits and track current spending.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#eff4ff] flex items-center justify-center transition-all text-[#464555]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Groceries, Travel, Entertainment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#eff4ff] border-none rounded-xl py-3 px-4 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
                Monthly Limit ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#464555] text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm font-numeric text-[#0b1c30] outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5 font-bold">
                Amount Spent So Far ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#464555] text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={spent}
                  onChange={(e) => setSpent(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm font-numeric text-[#0b1c30] outline-none font-bold text-[#3525cd]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#3525cd]/5 rounded-2xl">
            <input
              type="checkbox"
              id="alert-check"
              checked={enableAlert}
              onChange={(e) => setEnableAlert(e.target.checked)}
              className="rounded border-[#3525cd]/30 text-[#3525cd] focus:ring-[#3525cd]/20 w-5 h-5 cursor-pointer"
            />
            <label htmlFor="alert-check" className="text-xs font-medium text-[#464555] cursor-pointer">
              Enable smart alerts when I reach 80% of this budget
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-xs text-[#464555] hover:bg-[#eff4ff] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl font-bold text-xs bg-[#3525cd] text-white hover:bg-[#2b1cb8] transition-all shadow-lg shadow-[#3525cd]/20"
            >
              {initialData ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
