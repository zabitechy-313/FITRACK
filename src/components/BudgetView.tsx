import React from 'react';
import confetti from 'canvas-confetti';
import { BudgetCategoryItem } from '../types';
import { formatMoney } from '../data/currencies';

interface BudgetViewProps {
  categories: BudgetCategoryItem[];
  onOpenBudgetModal: () => void;
  currency?: string;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  categories,
  onOpenBudgetModal,
  currency = 'USD',
}) => {
  const handleCelebrateGoal = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3525cd', '#6cf8bb', '#4f46e5', '#ffd0d2'],
    });
  };

  const totalAllowance = categories.reduce((acc, cat) => acc + cat.allocated, 0);
  const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">Monthly Budget Overview</h2>
          <p className="text-[#464555] text-sm mt-1">
            Status for current cycle •{' '}
            <span className="text-[#006c49] font-bold">
              {totalSpent <= totalAllowance ? 'Safe Zone' : 'Attention Needed'}
            </span>
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-label-caps text-[#464555] uppercase tracking-widest text-xs mb-1">
            Total Monthly Allocation
          </p>
          <p className="font-numeric text-3xl font-bold text-[#3525cd]">
            {formatMoney(totalAllowance, currency)}
          </p>
        </div>
      </section>

      {/* Main Grid: Budgets & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Budget Categories Breakdown (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#0b1c30]">Category Breakdown</h3>
              <button
                onClick={onOpenBudgetModal}
                className="text-[#3525cd] font-semibold text-sm flex items-center gap-1 hover:underline"
              >
                <span>+ Set Category Limit</span>
                <span className="material-symbols-outlined text-base">add</span>
              </button>
            </div>

            <div className="space-y-7">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const isOver = cat.spent > cat.allocated;
                  const pct = cat.allocated > 0 ? Math.min(Math.round((cat.spent / cat.allocated) * 100), 100) : 0;
                  const remaining = cat.allocated - cat.spent;

                  return (
                    <div key={cat.id}>
                      <div className="flex justify-between items-end mb-2.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${cat.containerBg || 'bg-indigo-100'} flex items-center justify-center text-[#0b1c30] flex-shrink-0`}
                          >
                            <span className="material-symbols-outlined text-xl">{cat.icon || 'payments'}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[#0b1c30] text-base">{cat.name}</p>
                            <p
                              className={`text-xs font-medium ${
                                isOver
                                  ? 'text-[#ba1a1a] font-bold'
                                  : pct >= 90
                                  ? 'text-[#950029] font-bold'
                                  : 'text-[#006c49]'
                              }`}
                            >
                              {isOver
                                ? `Exceeded by ${formatMoney(Math.abs(remaining), currency)}`
                                : `${formatMoney(remaining, currency)} left of ${formatMoney(cat.allocated, currency)}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={`font-numeric text-lg font-bold ${
                              isOver ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
                            }`}
                          >
                            {formatMoney(cat.spent, currency)}
                          </p>
                          <p className="font-label-caps text-[10px] text-[#464555] uppercase">
                            Spent
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-[#eff4ff] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
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
                  <p className="text-xs text-[#464555] mt-1 mb-4">Set monthly spending targets for categories like Groceries, Dining, and Shopping.</p>
                  <button
                    onClick={onOpenBudgetModal}
                    className="px-5 py-2.5 rounded-full bg-[#3525cd] text-white font-bold text-xs hover:bg-[#2b1cb8]"
                  >
                    + Add Your First Budget
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Savings Goals & Insights (Right col) */}
        <div className="space-y-6">
          {/* Savings Progress Card */}
          <div className="bg-[#3525cd] text-white p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl shadow-[#3525cd]/25">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    savings
                  </span>
                  <h3 className="font-bold text-lg">Savings Goal</h3>
                </div>
                <button
                  onClick={handleCelebrateGoal}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full font-semibold transition-all"
                >
                  🎉 Milestone
                </button>
              </div>

              <p className="font-label-caps text-white/80 mb-1 uppercase tracking-widest text-xs">
                Emergency & Downpayment Fund
              </p>
              <p className="font-numeric text-3xl font-bold mb-6">
                {formatMoney(25000, currency)}{' '}
                <span className="text-sm font-normal text-white/60">
                  / {formatMoney(50000, currency)}
                </span>
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Current Progress</span>
                  <span className="font-bold">50%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: '50%' }}
                  />
                </div>
                <p className="text-xs text-white/80 italic pt-1">
                  Halfway there! Keep building your financial cushion.
                </p>
              </div>
            </div>
          </div>

          {/* Smart Insight Card */}
          <div className="glass-card p-6 rounded-3xl border border-[#006c49]/20 shadow-sm">
            <div className="w-12 h-12 bg-[#006c49]/10 rounded-2xl flex items-center justify-center text-[#006c49] mb-4">
              <span className="material-symbols-outlined text-2xl">lightbulb</span>
            </div>
            <h4 className="font-bold text-base text-[#0b1c30] mb-1.5">Smart Financial Tip</h4>
            <p className="text-[#464555] text-xs leading-relaxed">
              Setting custom budget targets helps keep your monthly expenses predictable and boost overall monthly net savings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
