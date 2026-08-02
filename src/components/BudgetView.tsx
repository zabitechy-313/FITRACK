import React from 'react';
import { BudgetCategoryItem } from '../types';
import { formatMoney } from '../data/currencies';

interface BudgetViewProps {
  categories: BudgetCategoryItem[];
  onOpenBudgetModal: (editingItem?: BudgetCategoryItem) => void;
  onDeleteBudget: (id: string) => void;
  currency?: string;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  categories,
  onOpenBudgetModal,
  onDeleteBudget,
  currency = 'USD',
}) => {
  const totalAllowance = categories.reduce((acc, cat) => acc + cat.allocated, 0);
  const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);
  const totalRemaining = totalAllowance - totalSpent;
  const overallPct = totalAllowance > 0 ? Math.min(Math.round((totalSpent / totalAllowance) * 100), 100) : 0;

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">Monthly Budget Overview</h2>
          <p className="text-[#464555] text-sm mt-1">
            Status for current cycle •{' '}
            <span
              className={`font-bold ${
                totalSpent > totalAllowance ? 'text-[#ba1a1a]' : 'text-[#006c49]'
              }`}
            >
              {totalSpent <= totalAllowance ? 'Safe Zone' : 'Attention Needed'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenBudgetModal()}
            className="bg-[#3525cd] text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 hover:bg-[#2b1cb8] transition-all shadow-md shadow-[#3525cd]/20"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Set Category Limit</span>
          </button>
        </div>
      </section>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/60">
          <p className="font-label-caps text-[#464555] uppercase tracking-wider text-[11px] mb-1 font-bold">
            Total Monthly Allocation
          </p>
          <p className="font-numeric text-2xl font-bold text-[#3525cd]">
            {formatMoney(totalAllowance, currency)}
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/60">
          <p className="font-label-caps text-[#464555] uppercase tracking-wider text-[11px] mb-1 font-bold">
            Total Spent
          </p>
          <p className="font-numeric text-2xl font-bold text-[#0b1c30]">
            {formatMoney(totalSpent, currency)}
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/60">
          <p className="font-label-caps text-[#464555] uppercase tracking-wider text-[11px] mb-1 font-bold">
            Remaining Capacity
          </p>
          <p
            className={`font-numeric text-2xl font-bold ${
              totalRemaining < 0 ? 'text-[#ba1a1a]' : 'text-[#006c49]'
            }`}
          >
            {formatMoney(totalRemaining, currency)}
          </p>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Budget Categories List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0b1c30]">Category Spending & Limits</h3>
              <span className="text-xs text-[#464555] font-semibold">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
              </span>
            </div>

            <div className="space-y-7">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const isOver = cat.spent > cat.allocated;
                  const pct = cat.allocated > 0 ? Math.min(Math.round((cat.spent / cat.allocated) * 100), 100) : 0;
                  const remaining = cat.allocated - cat.spent;

                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-2xl hover:bg-[#eff4ff]/50 transition-colors border border-transparent hover:border-[#c7c4d8]/20 group"
                    >
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl ${cat.containerBg || 'bg-indigo-100'} flex items-center justify-center text-[#0b1c30] flex-shrink-0`}
                          >
                            <span className="material-symbols-outlined text-xl">{cat.icon || 'payments'}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-[#0b1c30] text-base">{cat.name}</p>
                              <button
                                onClick={() => onOpenBudgetModal(cat)}
                                className="text-xs text-[#3525cd] font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline flex items-center gap-0.5"
                                title="Edit spent or limit"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit
                              </button>
                            </div>
                            <p
                              className={`text-xs font-medium mt-0.5 ${
                                isOver
                                  ? 'text-[#ba1a1a] font-bold'
                                  : pct >= 90
                                  ? 'text-[#950029] font-bold'
                                  : 'text-[#006c49]'
                              }`}
                            >
                              {isOver
                                ? `Exceeded limit by ${formatMoney(Math.abs(remaining), currency)}`
                                : `${formatMoney(remaining, currency)} remaining of ${formatMoney(cat.allocated, currency)} limit`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p
                              className={`font-numeric text-lg font-bold ${
                                isOver ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
                              }`}
                            >
                              {formatMoney(cat.spent, currency)}
                            </p>
                            <p className="font-label-caps text-[10px] text-[#464555] uppercase font-bold">
                              Spent
                            </p>
                          </div>

                          {/* Quick action options */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onOpenBudgetModal(cat)}
                              className="p-1.5 rounded-lg hover:bg-[#3525cd]/10 text-[#3525cd] transition-colors"
                              title="Update Spent / Limit"
                            >
                              <span className="material-symbols-outlined text-base">tune</span>
                            </button>
                            <button
                              onClick={() => onDeleteBudget(cat.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-[#ba1a1a] transition-colors"
                              title="Delete Budget Category"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-[#eff4ff] rounded-full overflow-hidden mt-3">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isOver ? '#ba1a1a' : cat.color || '#3525cd',
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-[#c7c4d8]/40 rounded-2xl p-6">
                  <span className="material-symbols-outlined text-4xl text-[#777587] mb-2">payments</span>
                  <p className="font-bold text-base text-[#0b1c30]">No budget limits set</p>
                  <p className="text-xs text-[#464555] mt-1 mb-4">
                    Set monthly spending limits for categories like Groceries, Travel, and Shopping.
                  </p>
                  <button
                    onClick={() => onOpenBudgetModal()}
                    className="px-5 py-2.5 rounded-full bg-[#3525cd] text-white font-bold text-xs hover:bg-[#2b1cb8]"
                  >
                    + Add Your First Budget Category
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right col: Spending Summary & Insights (Without Savings Goal) */}
        <div className="space-y-6">
          {/* Overall Utilization Card */}
          <div className="bg-[#3525cd] text-white p-6 rounded-3xl relative overflow-hidden shadow-xl shadow-[#3525cd]/20">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                  <h3 className="font-bold text-base">Monthly Capacity</h3>
                </div>
                <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">
                  {overallPct}% Used
                </span>
              </div>

              <p className="font-numeric text-3xl font-bold mb-3">
                {formatMoney(totalSpent, currency)}{' '}
                <span className="text-sm font-normal text-white/70">
                  / {formatMoney(totalAllowance, currency)}
                </span>
              </p>

              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${overallPct}%` }}
                />
              </div>

              <p className="text-xs text-white/80">
                {totalSpent > totalAllowance
                  ? 'Over budget limits. Review active categories.'
                  : 'You are managing your budget within safe limits.'}
              </p>
            </div>
          </div>

          {/* Smart Financial Tip */}
          <div className="glass-card p-6 rounded-3xl border border-[#006c49]/20 shadow-sm">
            <div className="w-10 h-10 bg-[#006c49]/10 rounded-2xl flex items-center justify-center text-[#006c49] mb-3">
              <span className="material-symbols-outlined text-xl">lightbulb</span>
            </div>
            <h4 className="font-bold text-base text-[#0b1c30] mb-1.5">Smart Budget Tip</h4>
            <p className="text-[#464555] text-xs leading-relaxed">
              Track how much you spend in each category. Adjusting allowances helps ensure your monthly savings remain predictable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
