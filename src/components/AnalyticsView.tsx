import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  monthlyIncomeVsExpenseData,
  weeklySpendingTrend,
  categoryDistribution,
} from '../data/mockData';
import { formatMoney } from '../data/currencies';

interface AnalyticsViewProps {
  currency?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currency = 'USD' }) => {
  const [period, setPeriod] = useState<'Week' | 'Month' | 'Year'>('Month');

  const handleExportReport = () => {
    alert('Generating & downloading FinTrack Monthly Financial Report (PDF)...');
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Dashboard Header & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">Financial Insights</h2>
          <p className="text-[#464555] text-sm mt-1">
            Your spending habits and performance for the selected period.
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

      {/* Insights Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Insight Card 1 */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 bg-[#6cf8bb]/30 text-[#006c49] rounded-xl">
                <span className="material-symbols-outlined text-xl">trending_down</span>
              </span>
              <span className="text-xs font-label-caps text-[#006c49] font-bold">
                +2.4% vs last mo.
              </span>
            </div>
            <h3 className="text-[#464555] text-xs uppercase font-label-caps mb-1">
              Food & Dining
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="font-numeric text-3xl font-bold text-[#0b1c30]">{formatMoney(1240, currency)}</span>
              <span className="text-[#006c49] text-xs font-bold">15% Less</span>
            </div>
          </div>
          <p className="text-xs text-[#464555] mt-4 leading-relaxed">
            Great job! You stayed under your {formatMoney(1400, currency)} food budget this month.
          </p>
        </div>

        {/* Key Insight Card 2 */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <span className="material-symbols-outlined text-xl">warning</span>
              </span>
              <span className="text-xs font-label-caps text-amber-700 font-bold">
                Limit Reached
              </span>
            </div>
            <h3 className="text-[#464555] text-xs uppercase font-label-caps mb-1">Shopping</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-numeric text-3xl font-bold text-[#0b1c30]">{formatMoney(890, currency)}</span>
              <span className="text-amber-700 text-xs font-bold">8% More</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-[#eff4ff] h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-amber-500 h-full w-[95%] rounded-full" />
            </div>
            <p className="text-xs text-[#464555] mt-2">
              You have {formatMoney(50, currency)} remaining in your shopping category.
            </p>
          </div>
        </div>

        {/* Key Insight Card 3 */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 bg-[#3525cd]/10 text-[#3525cd] rounded-xl">
                <span className="material-symbols-outlined text-xl">savings</span>
              </span>
              <span className="text-xs font-label-caps text-[#3525cd] font-bold">
                Projected
              </span>
            </div>
            <h3 className="text-[#464555] text-xs uppercase font-label-caps mb-1">
              Net Savings
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="font-numeric text-3xl font-bold text-[#0b1c30]">{formatMoney(3150, currency)}</span>
              <span className="text-[#3525cd] text-xs font-bold">+12% Target</span>
            </div>
          </div>
          <p className="text-xs text-[#464555] mt-4 leading-relaxed">
            On track to save $37k by year end. Your highest savings month so far.
          </p>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses Comparison */}
        <div className="glass-card rounded-3xl p-6 md:p-8 col-span-1 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h3 className="text-xl font-bold text-[#0b1c30]">Income vs Expenses</h3>
              <p className="text-xs text-[#464555]">Historical monthly net variance</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#3525cd]" />
                <span className="text-xs font-medium text-[#464555]">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#006c49]" />
                <span className="text-xs font-medium text-[#464555]">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIncomeVsExpenseData} barGap={6}>
                <XAxis dataKey="month" stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#777587" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#0b1c30',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="income" fill="#3525cd" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#006c49" radius={[6, 6, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Trends Area Chart */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0b1c30]">Spending Trend</h3>
              <p className="text-xs text-[#464555]">Daily cadence for current week</p>
            </div>
            <button className="text-[#464555] hover:text-[#3525cd]">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySpendingTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3525cd" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3525cd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(value: any) => [`$${value}`, 'Spending']}
                  contentStyle={{
                    backgroundColor: '#0b1c30',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3525cd"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category Donut Chart */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0b1c30]">Category Distribution</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-[#3525cd] hover:underline">
              <span>Details</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-44 h-44 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Allocation']}
                    contentStyle={{
                      backgroundColor: '#0b1c30',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-grow space-y-3 w-full">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium text-[#0b1c30]">{cat.name}</span>
                  </div>
                  <span className="font-numeric text-sm font-bold text-[#0b1c30]">
                    {cat.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#0b1c30]">Unusual Activity</h3>
          <span className="text-xs uppercase font-label-caps text-[#464555]">
            Last 7 Days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-[#3525cd]/40 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-bold text-[#0b1c30] truncate">Electronics Store</p>
              <p className="text-xs text-[#464555]">24 Apr • Out of category spike</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <p className="font-numeric font-bold text-[#ba1a1a]">-$450.00</p>
              <span className="material-symbols-outlined text-[#464555] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-[#3525cd]/40 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-[#006c49]/10 text-[#006c49] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-bold text-[#0b1c30] truncate">Annual Tax Refund</p>
              <p className="text-xs text-[#464555]">22 Apr • Unusual income bonus</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <p className="font-numeric font-bold text-[#006c49]">+$1,200.00</p>
              <span className="material-symbols-outlined text-[#464555] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
