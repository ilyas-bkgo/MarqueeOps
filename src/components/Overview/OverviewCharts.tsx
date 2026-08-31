import React, { useState } from 'react';
import { MetricOverview } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Calendar, BarChart2 } from 'lucide-react';

interface OverviewChartsProps {
  metrics: MetricOverview | null;
}

export const OverviewCharts: React.FC<OverviewChartsProps> = ({ metrics }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [metricFocus, setMetricFocus] = useState<'signups' | 'activeUsers'>('signups');

  // Generate data based on selected range for realistic interaction
  const chartData = React.useMemo(() => {
    if (!metrics) return [];
    if (timeRange === '7d') {
      return metrics.chartData;
    }
    if (timeRange === '30d') {
      return [
        { date: 'W1', signups: 84, activeUsers: 290, conversions: 22 },
        { date: 'W2', signups: 92, activeUsers: 320, conversions: 28 },
        { date: 'W3', signups: 104, activeUsers: 350, conversions: 34 },
        { date: 'W4', signups: 118, activeUsers: 384, conversions: 41 },
      ];
    }
    return [
      { date: 'Jun', signups: 320, activeUsers: 980, conversions: 88 },
      { date: 'Jul', signups: 410, activeUsers: 1150, conversions: 112 },
      { date: 'Aug', signups: 490, activeUsers: 1428, conversions: 145 },
    ];
  }, [metrics, timeRange]);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900">Client Demand & Delivery Momentum</h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            New client opportunities compared with active delivery capacity
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Series Toggle */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs">
            <button
              onClick={() => setMetricFocus('signups')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                metricFocus === 'signups'
                  ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              New Briefs
            </button>
            <button
              onClick={() => setMetricFocus('activeUsers')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                metricFocus === 'activeUsers'
                  ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Delivery Capacity
            </button>
          </div>

          {/* Time Range Toggle */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-md font-mono transition-all ${
                  timeRange === r
                    ? 'bg-zinc-900 text-white shadow-2xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#18181b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradientActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-zinc-900 text-white p-3 rounded-lg shadow-xl border border-zinc-800 text-xs font-mono">
                      <div className="text-zinc-400 font-semibold mb-1">{label}</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-300">New briefs:</span>
                          <span className="font-bold text-white">+{payload[0]?.value}</span>
                        </div>
                        {payload[1] && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-indigo-300">Delivery capacity:</span>
                            <span className="font-bold text-indigo-200">{payload[1]?.value}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metricFocus === 'signups' ? 'signups' : 'activeUsers'}
              stroke={metricFocus === 'signups' ? '#18181b' : '#6366f1'}
              strokeWidth={2}
              fillOpacity={1}
              fill={metricFocus === 'signups' ? 'url(#gradientSignups)' : 'url(#gradientActive)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 inline-block" /> New brief velocity
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" /> Delivery capacity
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Source: MarqueeOps activity stream
        </span>
      </div>
    </div>
  );
};
