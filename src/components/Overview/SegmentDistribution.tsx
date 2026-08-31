import React from 'react';
import { MetricOverview } from '../../types';
import { PieChart, Shield, Users } from 'lucide-react';
import { RoleBadge } from '../Common/RBACBadge';

interface SegmentDistributionProps {
  metrics: MetricOverview | null;
}

export const SegmentDistribution: React.FC<SegmentDistributionProps> = ({ metrics }) => {
  if (!metrics) return null;

  const totalSegmentUsers = metrics.segmentDistribution.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Client verticals */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900">Client Vertical Mix</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500 font-medium">
            {metrics.segmentDistribution.length} Verticals
          </span>
        </div>

        <div className="space-y-3">
          {metrics.segmentDistribution.map((item) => {
            const percentage = Math.round((item.value / totalSegmentUsers) * 100);
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-800">{item.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-600 font-semibold">{item.growth}</span>
                    <span className="text-zinc-500">{item.value} accounts ({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Distribution & RBAC Security Breakdown */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-700" />
              <h3 className="text-sm font-bold text-zinc-900">Access Governance (RBAC)</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {metrics.roleCounts.superAdmin + metrics.roleCounts.admin + metrics.roleCounts.viewer} Team members
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-zinc-900 text-white rounded-lg border border-zinc-800 text-center">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase font-semibold">
                Super Admin
              </span>
              <span className="text-xl font-bold font-mono block mt-1">
                {metrics.roleCounts.superAdmin}
              </span>
              <span className="text-[10px] text-violet-300 block mt-0.5">Full root</span>
            </div>

            <div className="p-3 bg-zinc-100 text-zinc-900 rounded-lg border border-zinc-200 text-center">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase font-semibold">
                Admin
              </span>
              <span className="text-xl font-bold font-mono block mt-1">
                {metrics.roleCounts.admin}
              </span>
              <span className="text-[10px] text-zinc-600 block mt-0.5">Workspace ops</span>
            </div>

            <div className="p-3 bg-zinc-50 text-zinc-900 rounded-lg border border-zinc-200 text-center">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase font-semibold">
                Viewer
              </span>
              <span className="text-xl font-bold font-mono block mt-1">
                {metrics.roleCounts.viewer}
              </span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Read-only</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-600 leading-relaxed">
          <span className="font-semibold text-zinc-900">Least Privilege Principle:</span> Only Super
          Admins can change user roles or promote peers. Admins have user maintenance access without
          privilege elevation authority.
        </div>
      </div>
    </div>
  );
};
