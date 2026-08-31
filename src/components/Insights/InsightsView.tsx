import React, { useState, useMemo } from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { AIInsight } from '../../types';
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  Users,
  Shield,
  Lightbulb,
  ArrowUpRight,
  ArrowRight,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { insights, refreshInsights, isGeneratingInsights, metrics, users, addToast } = usePulseBoard();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Growth' | 'Retention' | 'Security' | 'Segment'>('ALL');
  const [askQuery, setAskQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [customAnswer, setCustomAnswer] = useState<{ query: string; answer: string; metric: string } | null>(null);

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'Growth':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'Retention':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'Security':
        return <Shield className="w-4 h-4 text-rose-600" />;
      case 'Segment':
        return <Zap className="w-4 h-4 text-violet-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
    }
  };

  const getImpactBadge = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'positive':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Positive Momentum
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            Strategic Priority
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Anomaly Warning
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            Observation
          </span>
        );
    }
  };

  const filteredInsights = useMemo(() => {
    if (categoryFilter === 'ALL') return insights;
    return insights.filter((i) => i.category === categoryFilter);
  }, [insights, categoryFilter]);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;

    setIsAsking(true);
    setTimeout(() => {
      const q = askQuery.toLowerCase();
      let ans = '';
      let met = '';

      if (q.includes('churn') || q.includes('retention') || q.includes('drop')) {
        ans = `Current cohort analysis shows churn is steady at ${metrics?.churnRate || 1.8}% (within safe boundaries). The highest retention is observed in Enterprise SaaS accounts with MFA enabled, while Starter free-tier accounts represent 72% of attrition.`;
        met = `${metrics?.churnRate || 1.8}% Churn`;
      } else if (q.includes('fintech') || q.includes('segment') || q.includes('growth')) {
        ans = `The Fintech segment continues to lead overall SaaS adoption at 38% of total volume (+18.4% WoW). Developer Tools is the second fastest growing cluster with 24% adoption and 85% active engagement.`;
        met = `+18.4% Fintech WoW`;
      } else if (q.includes('security') || q.includes('mfa') || q.includes('role') || q.includes('admin')) {
        ans = `There are ${metrics?.roleCounts.superAdmin || 2} Super Admins and ${metrics?.roleCounts.admin || 5} Admins in the directory. All admin accounts have verified hardware MFA keys, passing SOC2 compliance benchmarks.`;
        met = `100% MFA Compliance`;
      } else {
        ans = `Across all 20 monitored accounts, weekly active concurrency is up by ${metrics?.activeTodayTrend || 6.8}%. Total MRR is tracking at $${((metrics?.mrr || 42800) / 1000).toFixed(1)}k with 6 accounts identified as prime candidates for Pro-to-Enterprise tier upgrade.`;
        met = `$${((metrics?.mrr || 42800) / 1000).toFixed(1)}k MRR`;
      }

      setCustomAnswer({ query: askQuery, answer: ans, metric: met });
      setIsAsking(false);
      addToast('info', 'AI Response Synthesized', 'Generated data summary from current metrics');
    }, 600);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-violet-950 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle glow circle */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-violet-500/30 border border-violet-400/40 text-violet-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-violet-300 font-semibold">
              Gemini 3.7 Flash Intelligence Hub
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            AI-Assisted Executive Insights & Telemetry
          </h2>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Real-time automated machine summaries synthesizing user cohort adoption, churn risk signals,
            and RBAC compliance posture from your live Postgres dataset.
          </p>
        </div>

        <button
          onClick={refreshInsights}
          disabled={isGeneratingInsights}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg text-xs font-bold transition-all shadow-lg shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-violet-600 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
          <span>{isGeneratingInsights ? 'Synthesizing Data...' : 'Regenerate All Insights'}</span>
        </button>
      </div>

      {/* Interactive AI Question Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h3 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
            Ask PulseBoard AI (Cohort Assistant)
          </h3>
        </div>

        <form onSubmit={handleAskAI} className="flex gap-2">
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder="e.g. 'Summarize Fintech growth factors' or 'What is driving churn rate?'"
            className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <button
            type="submit"
            disabled={isAsking || !askQuery.trim()}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAsking ? 'Thinking...' : 'Ask AI'}</span>
          </button>
        </form>

        {/* Quick Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-zinc-100">
          <span className="text-[11px] text-zinc-400 font-mono">Suggested:</span>
          {[
            'Summarize Fintech growth velocity',
            'Analyze churn risks in Starter tier',
            'Are all Admin roles MFA compliant?',
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setAskQuery(suggestion)}
              className="text-[11px] text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Custom AI Answer Card */}
        {customAnswer && (
          <div className="mt-4 p-4 bg-violet-50/70 border border-violet-200 rounded-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-violet-600 text-white rounded-md mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-violet-900">
                    Q: "{customAnswer.query}"
                  </div>
                  <p className="text-xs text-zinc-800 mt-1 leading-relaxed">
                    {customAnswer.answer}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-violet-200 text-violet-900 font-mono font-bold text-xs shrink-0">
                {customAnswer.metric}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2">
        {(
          [
            { id: 'ALL', label: 'All Insights', count: insights.length },
            {
              id: 'Growth',
              label: 'Growth & Acquisition',
              count: insights.filter((i) => i.category === 'Growth').length,
            },
            {
              id: 'Retention',
              label: 'Retention & Churn',
              count: insights.filter((i) => i.category === 'Retention').length,
            },
            {
              id: 'Security',
              label: 'RBAC & Security',
              count: insights.filter((i) => i.category === 'Security').length,
            },
            {
              id: 'Segment',
              label: 'Segment Analysis',
              count: insights.filter((i) => i.category === 'Segment').length,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              categoryFilter === tab.id
                ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                categoryFilter === tab.id ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs hover:border-violet-300 hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-zinc-800" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-zinc-50 border border-zinc-200">
                    {getCategoryIcon(card.category)}
                  </div>
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
                    {card.category}
                  </span>
                </div>
                {getImpactBadge(card.impact)}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-zinc-900 mb-2 leading-snug">
                {card.title}
              </h3>

              {/* Natural Language Summary */}
              <p className="text-xs text-zinc-700 leading-relaxed mb-4">
                {card.summary}
              </p>

              {/* Recommendation pill */}
              {card.recommendation && (
                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-lg mb-4 text-xs">
                  <span className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Actionable Next Step:
                  </span>
                  <p className="text-zinc-600 leading-relaxed text-[11px]">
                    {card.recommendation}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Telemetry */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400">
                  Model Confidence: <strong className="text-zinc-700">{card.confidence}%</strong>
                </span>
                <span className="text-zinc-300">·</span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  {card.source || 'gemini'}
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded border border-violet-200">
                {card.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
