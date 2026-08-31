import React from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { MetricCards } from './MetricCards';
import { OverviewCharts } from './OverviewCharts';
import { AIInsightsSection } from './AIInsightsSection';
import { SegmentDistribution } from './SegmentDistribution';
import { OverviewActivityFeed } from './OverviewActivityFeed';

export const OverviewView: React.FC = () => {
  const { metrics, isLoading } = usePulseBoard();

  if (isLoading && !metrics) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-28 bg-zinc-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-zinc-100 rounded-xl animate-pulse" />
        <div className="h-48 bg-zinc-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top 5 Key Metric Cards */}
      <MetricCards metrics={metrics} />

      {/* AI-Assisted Insight Cards Section */}
      <AIInsightsSection />

      {/* Time-Series Chart */}
      <OverviewCharts metrics={metrics} />

      {/* Industry Segments & Role Governance */}
      <SegmentDistribution metrics={metrics} />

      {/* Real-time Activity Feed */}
      <OverviewActivityFeed />
    </div>
  );
};
