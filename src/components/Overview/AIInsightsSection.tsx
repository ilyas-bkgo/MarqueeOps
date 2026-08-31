import React from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { AIInsight } from '../../types';
import { Sparkles, RefreshCw, ArrowRight, Lightbulb, Shield, TrendingUp, Users } from 'lucide-react';

export const AIInsightsSection: React.FC = () => {
  const { insights, refreshInsights, isGeneratingInsights, setActiveView } = usePulseBoard();

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'Growth':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Retention':
        return <Users className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Security':
        return <Shield className="w-3.5 h-3.5 text-rose-600" />;
      case 'Segment':
        return <Sparkles className="w-3.5 h-3.5 text-violet-600" />;
      default:
        return <Lightbulb className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const getImpactBadge = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'positive':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Positive Impact
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-violet-50 text-violet-700 border border-violet-200">
            High Priority
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200">
            Anomaly Flag
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            Observation
          </span>
        );
    }
  };

  // Preview top 3 insights on Overview
  const previewInsights = insights.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-zinc-50 via-white to-violet-50/20 rounded-xl border border-zinc-200/90 p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900">Portfolio Intelligence</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-violet-100 text-violet-800 border border-violet-200">
                Gemini 3.7
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Decision-ready signals for client health, delivery risk, and account growth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshInsights}
            disabled={isGeneratingInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium border border-zinc-300 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-violet-600 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
            <span>{isGeneratingInsights ? 'Regenerating...' : 'Refresh Insights'}</span>
          </button>

          <button
            onClick={() => setActiveView('insights')}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <span>View All ({insights.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {previewInsights.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-violet-200/70 p-4 shadow-2xs hover:border-violet-300 hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Subtle AI indicator accent top line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-zinc-400" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                  {getCategoryIcon(card.category)}
                  <span>{card.category}</span>
                </div>
                {getImpactBadge(card.impact)}
              </div>

              <h4 className="text-xs font-bold text-zinc-900 leading-snug mb-1.5">
                {card.title}
              </h4>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {card.summary}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400">
                Confidence: {card.confidence}%
              </span>
              <span className="text-[11px] font-mono font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200/60">
                {card.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
