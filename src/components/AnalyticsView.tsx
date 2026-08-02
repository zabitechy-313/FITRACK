import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Transaction } from '../types';
import { formatMoney } from '../data/currencies';

interface AnalyticsViewProps {
  transactions?: Transaction[];
  currency?: string;
}

const CATEGORY_COLORS = [
  '#3525cd',
  '#006c49',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#64748b',
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions = [],
  currency = 'USD',
}) => {
  const [period, setPeriod] = useState<'Week' | 'Month' | 'Year'>('Month');

  // Compute live dynamic stats from transactions
  const {
    totalIncome,
    totalExpenses,
    netSavings,
    categoryBreakdown,
    topExpenseCategory,
    topExpenseAmount,
  } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += Math.abs(tx.amount);
      } else {
        const amt = Math.abs(tx.amount);
        expenses += amt;
        catMap[tx.category] = (catMap[tx.category] || 0) + amt;
      }
    });

    const breakdown = Object.entries(catMap)
      .map(([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);

    const topCat = breakdown[0]?.name || 'No expenses';
    const topAmt = breakdown[0]?.value || 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netSavings: income - expenses,
      categoryBreakdown: breakdown,
      topExpenseCategory: topCat,
      topExpenseAmount: topAmt,
    };
  }, [transactions]);

  // Monthly breakdown chart data generated from transactions or fallback to baseline
  const chartData = useMemo(() => {
    if (transactions.length === 0) {
      return [
        { name: 'Jan', income: 0, expense: 0 },
        { name: 'Feb', income: 0, expense: 0 },
        { name: 'Mar', income: 0, expense: 0 },
        { name: 'Apr', income: 0, expense: 0 },
      ];
    }

    // Basic aggregation or display
    return [
      { name: 'Current Cycle', income: totalIncome, expense: totalExpenses },
    ];
  }, [transactions, totalIncome, totalExpenses]);

  const handleExportReport = () => {
    alert('Generating & downloading FinTrack Financial Report (PDF)...');
  };

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Dashboard Header & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">Financial Insights</h2>
          <p className="text-[#464555] text-sm mt-1">
            Real-time analytics computed directly from your transaction history.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 p-1 bg-[#eff4ff] rounded-xl border border-[#c7c4d8]/20">
            {(['Week', 'Month', 'Year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  period === p
                    ? 'bg-white shadow-sm text-[#3525cd]'
                    : 'text-[#464555] hover:bg-[#e5eeff]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="bg-[#3525cd] text-white px-5 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-[#3525cd]/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {!hasData && (
        <div className="glass-card p-6 rounded-3xl border border-[#3525cd]/20 bg-[#eff4ff]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center font-bold flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">analytics</span>
            </div>
            <div>
              <h4 className="font-bold text-[#0b1c30] text-base">New User Insights Active</h4>
              <p className="text-xs text-[#464555] mt-0.5">
                All metrics are clear and ready. Add transactions to generate dynamic category charts and monthly variance trends!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Insights Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Insight Card 1: Total Expenses / Top Category */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <span className="material-symbols-outlined text-xl">payments</span>
              </span>
              <span className="text-xs font-label-caps text-amber-700 font-bold">
                Total Expenses
              </span>
            </div>
            <h3 className="text-[#464555] text-xs uppercase font-label-caps mb-1 font-bold">
              Total Spending
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="font-numeric text-3xl font-bold text-[#0b1c30]">
                {formatMoney(totalExpenses, currency)}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#464555] mt-4 leading-relaxed">
            {hasData
              ? `Highest spend category: ${topExpenseCategory} (${formatMoney(topExpenseAmount, currency)}).`
              : 'No expenses recorded yet.'}
          </p>
        </div>

        {/* Key Insight Card 2: Total Income */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 bg-[#6cf8bb]/30 text-[#006c49] rounded-xl">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </span>
              <span className="text-xs font-label-caps text-[#006c49] font-bold">
                Total Income
              </span>
            </div>
            <h3 className="text-[#464555] text-xs uppercase font-label-caps mb-1 font-bold">
              Total Revenue
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="font-numeric text-3xl font-bold text-[#0b1c30]">
                {formatMoney(totalIncome, currency)}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#464555] mt-4 leading-relaxed">
            {hasData
              ? `${transactions.filter((t) => t.type === 'income').length} income deposits logged.`
              : 'No income logged yet.'}
          </p>
        </div>

        {/* Key Insight Card 3: Net Cashflow / Savings */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 bg-[#3525cd]/10 text-[#3525cd] rounded-xl">
                <span className="material-symbols-outlined text-xl">account_balance</span>
              </span>
              <span className="text-xs font-label-caps text-[#3525cd] font-bold">
                Net Cashflow
              </span>
            </div>
            <h3 className="text-[#464555] text-xs uppercase font-label-caps mb-1 font-bold">
              Net Balance
            </h3>
            <div className="flex items-baseline gap-2">
              <span
                className={`font-numeric text-3xl font-bold ${
                  netSavings >= 0 ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                }`}
              >
                {formatMoney(netSavings, currency)}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#464555] mt-4 leading-relaxed">
            {netSavings >= 0
              ? 'Positive net income flow for this period.'
              : 'Spending exceeds income. Review your expenses.'}
          </p>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0b1c30]">Cash Flow Analysis</h3>
              <p className="text-xs text-[#464555]">Comparison of total income vs expenses</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#464555' }} />
                <YAxis tick={{ fontSize: 12, fill: '#464555' }} />
                <Tooltip
                  formatter={(val: number) => [formatMoney(val, currency), '']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                />
                <Bar dataKey="income" name="Income" fill="#006c49" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#3525cd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0b1c30]">Expense Breakdown</h3>
              <p className="text-xs text-[#464555]">Distribution across spending categories</p>
            </div>
          </div>

          {categoryBreakdown.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-56 w-56 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [formatMoney(val, currency), 'Total']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2.5 w-full">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-[#0b1c30] truncate">{cat.name}</span>
                    </div>
                    <span className="font-numeric font-bold text-[#0b1c30]">
                      {formatMoney(cat.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#c7c4d8]/40 rounded-2xl">
              <span className="material-symbols-outlined text-3xl text-[#777587] mb-2">pie_chart</span>
              <p className="font-bold text-sm text-[#0b1c30]">No expenses recorded</p>
              <p className="text-xs text-[#464555] mt-1">Add expense transactions to view category distribution.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
