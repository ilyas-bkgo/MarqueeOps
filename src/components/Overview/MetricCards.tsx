import React from 'react';
import { MetricOverview } from '../../types';
import { Users, UserCheck, UserPlus, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricOverview | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-28 bg-white rounded-xl border border-zinc-200 p-4 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'total-users',
      label: 'Client Portfolio',
      value: metrics.totalUsers.toLocaleString(),
      trend: metrics.totalUsersTrend,
      trendLabel: 'vs last month',
      isPositive: metrics.totalUsersTrend > 0,
      icon: <Users className="w-4 h-4 text-zinc-700" />,
      subtext: `${metrics.statusCounts.active} active · ${metrics.statusCounts.invited} onboarding`,
    },
    {
      id: 'active-today',
      label: 'Accounts On Track',
      value: metrics.activeToday.toLocaleString(),
      trend: metrics.activeTodayTrend,
      trendLabel: 'vs last review',
      isPositive: metrics.activeTodayTrend > 0,
      icon: <UserCheck className="w-4 h-4 text-zinc-700" />,
      subtext: `${((metrics.activeToday / metrics.totalUsers) * 100).toFixed(1)}% of portfolio`,
    },
    {
      id: 'signups-week',
      label: 'New Client Briefs',
      value: `+${metrics.signupsThisWeek}`,
      trend: metrics.signupsThisWeekTrend,
      trendLabel: 'vs prev week',
      isPositive: metrics.signupsThisWeekTrend > 0,
      icon: <UserPlus className="w-4 h-4 text-zinc-700" />,
      subtext: 'Priority pipeline this week',
    },
    {
      id: 'churn-rate',
      label: 'At-Risk Retainers',
      value: `${metrics.churnRate}%`,
      trend: metrics.churnRateTrend,
      trendLabel: 'vs last month',
      isPositive: metrics.churnRateTrend <= 0, // Less churn is good!
      icon: <TrendingDown className="w-4 h-4 text-zinc-700" />,
      subtext: 'Review before renewal',
    },
    {
      id: 'mrr',
      label: 'Retainer Revenue',
      value: `$${(metrics.mrr / 1000).toFixed(1)}k`,
      trend: metrics.mrrTrend,
      trendLabel: 'monthly growth',
      isPositive: metrics.mrrTrend > 0,
      icon: <DollarSign className="w-4 h-4 text-zinc-700" />,
      subtext: 'Expansion opportunities identified',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl border border-zinc-200/90 p-4 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">{card.label}</span>
            <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-100">{card.icon}</div>
          </div>

          <div className="my-2">
            <div className="text-2xl font-extrabold text-zinc-900 tracking-tight font-mono">
              {card.value}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
            <span className="text-[11px] text-zinc-400 truncate max-w-[110px]">
              {card.subtext}
            </span>
            <div
              className={`inline-flex items-center gap-0.5 text-xs font-semibold font-mono ${
                card.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {card.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(card.trend)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
