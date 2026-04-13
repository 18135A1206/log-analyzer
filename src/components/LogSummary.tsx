import React from 'react';
import { LogSummary as LogSummaryType } from '@/types/log';
import { BarChart3, TrendingUp } from 'lucide-react';

export interface LogSummaryProps {
  summary: LogSummaryType;
}

/**
 * Component to display log summary statistics with modern design
 */
export const LogSummary: React.FC<LogSummaryProps> = ({ summary }) => {
  const stats = [
    { label: 'Total', count: summary.total, variant: 'default' as const, color: 'bg-gradient-to-r from-slate-500 to-slate-600' },
    { label: 'Errors', count: summary.error, variant: 'error' as const, color: 'bg-gradient-to-r from-red-500 to-red-600' },
    { label: 'Warnings', count: summary.warn, variant: 'warn' as const, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { label: 'Info', count: summary.info, variant: 'info' as const, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { label: 'Debug', count: summary.debug, variant: 'debug' as const, color: 'bg-gradient-to-r from-gray-500 to-gray-600' },
  ];

  const totalIssues = summary.error + summary.warn;
  const healthScore = Math.max(0, Math.min(100, 100 - (totalIssues / summary.total) * 100));

  return (
    <div className="bg-gray-100 rounded-lg border border-gray-300 p-4 space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-900 p-1.5 rounded-lg">
            <BarChart3 className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Log Analysis Summary</h2>
            <p className="text-xs text-gray-700 font-medium">Statistics and insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-gray-200 rounded-lg px-3 py-1 border border-gray-400">
          {(() => {
            let healthColor = 'text-red-700';
            if (healthScore > 80) {
              healthColor = 'text-green-700';
            } else if (healthScore > 60) {
              healthColor = 'text-amber-700';
            }
            return <TrendingUp className={`w-3 h-3 ${healthColor}`} />;
          })()}
          <span className="text-xs font-bold text-gray-900">
            Health: {healthScore.toFixed(0)}%
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="group relative overflow-hidden bg-white rounded-lg border border-gray-300 p-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <div className="flex flex-col items-center text-center space-y-1">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <span className="text-white font-bold text-xs">
                  {stat.label.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-700 mb-0.5 font-semibold">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">
                  {stat.count.toLocaleString()}
                </p>
                {summary.total > 0 && (
                  <p className="text-xs text-gray-600 font-medium">
                    {((stat.count / summary.total) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};