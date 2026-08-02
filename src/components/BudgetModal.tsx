import React, { useState } from 'react';
import { BudgetCategoryItem, TransactionCategory } from '../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBudget: (category: BudgetCategoryItem) => void;
  currencySymbol?: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onAddBudget,
  currencySymbol = '$',
}) => {
  const [name, setName] = useState('Travel & Vacations');
  const [amount, setAmount] = useState('800');
  const [enableAlert, setEnableAlert] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const allocated = parseFloat(amount);
    const newCategory: BudgetCategoryItem = {
      id: `bgt-${Date.now()}`,
      name,
      category: 'Other' as TransactionCategory,
      allocated,
      spent: 0,
      icon: 'flight_takeoff',
      color: '#3525cd',
      containerBg: 'bg-indigo-100',
    };

    onAddBudget(newCategory);
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
            <h3 className="text-xl font-bold text-[#0b1c30]">Set New Budget</h3>
            <p className="text-xs text-[#464555] mt-0.5">
              Define limits for a new spending category.
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
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
              Category Name
            </label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#eff4ff] border-none rounded-xl py-3 px-4 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#3525cd]/20 cursor-pointer outline-none"
            >
              <option value="Travel & Vacations">Travel & Vacations</option>
              <option value="Healthcare & Wellness">Healthcare & Wellness</option>
              <option value="Groceries & Household">Groceries & Household</option>
              <option value="Utilities & Subscriptions">Utilities & Subscriptions</option>
              <option value="Custom Category">Custom Category</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-label-caps text-[#464555] uppercase mb-1.5">
              Monthly Allowance ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#464555] text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="10"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 text-sm font-numeric text-[#0b1c30] outline-none"
              />
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
              className="flex-1 py-3 px-6 rounded-xl font-bold text-xs bg-[#3525cd] text-white hover:opacity-90 transition-all shadow-lg shadow-[#3525cd]/20"
            >
              Create Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
