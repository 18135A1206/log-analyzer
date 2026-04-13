import React, { memo } from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LogLevel } from '@/types/log';

export interface LogControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFilters: LogLevel[];
  onFilterChange: (filters: LogLevel[]) => void;
  onClearLogs: () => void;
  totalEntries: number;
  filteredEntries: number;
}

const logLevelOptions = [
  { level: 'error' as LogLevel, textColor: 'text-red-600' },
  { level: 'warn' as LogLevel, textColor: 'text-yellow-600' },
  { level: 'info' as LogLevel, textColor: 'text-blue-600' },
  { level: 'debug' as LogLevel, textColor: 'text-gray-600' },
  { level: 'trace' as LogLevel, textColor: 'text-purple-600' },
] as const;

/**
 * Controls component for log filtering, searching, and management
 */
export const LogControls: React.FC<LogControlsProps> = memo(function LogControls({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange,
  onClearLogs,
  totalEntries,
  filteredEntries
}) {
  const handleFilterToggle = (level: LogLevel) => {
    const newFilters = selectedFilters.includes(level)
      ? selectedFilters.filter(f => f !== level)
      : [...selectedFilters, level];
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  const selectAllFilters = () => {
    onFilterChange(logLevelOptions.map(option => option.level));
  };

  return (
    <div className="bg-gray-100 rounded-lg border border-gray-300 p-4 space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-900 p-1.5 rounded-lg">
            <Filter className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Log Controls</h2>
            <p className="text-xs text-gray-700 font-medium">Filter and search logs</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-700">
          <span className="font-semibold">
            Showing {filteredEntries.toLocaleString()} of {totalEntries.toLocaleString()} entries
          </span>
        </div>
      </div>

      {/* Search Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-bold text-gray-900">Search</span>
        </div>
        <div className="relative group">
          <Input
            type="text"
            placeholder="Search log messages..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9 bg-white border-gray-400 text-gray-900 placeholder:text-gray-600 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 font-mono font-medium"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-600" />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-900">Log Level Filters</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={selectAllFilters}
              className="text-xs px-2 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
            >
              All
            </button>
            {selectedFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {logLevelOptions.map(({ level, textColor }) => {
            const isActive = selectedFilters.includes(level);
            return (
              <button
                key={level}
                onClick={() => handleFilterToggle(level)}
                className={`p-2 rounded-lg border transition-all duration-200 font-mono ${
                  isActive
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-400 bg-white text-gray-800 hover:border-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : textColor}`}>
                    {level.toUpperCase()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-400">
        <Button
          variant="outline"
          onClick={onClearLogs}
          className="flex items-center space-x-1 bg-red-100 border-red-400 text-red-800 hover:bg-red-200 font-semibold text-sm"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Clear Logs</span>
        </Button>
        
        <div className="ml-auto flex items-center space-x-4">
          {(searchTerm || selectedFilters.length > 0) && (
            <div className="text-xs text-gray-500">
              {selectedFilters.length > 0 && (
                <span>{selectedFilters.length} filter{selectedFilters.length !== 1 ? 's' : ''} active</span>
              )}
              {searchTerm && selectedFilters.length > 0 && <span> • </span>}
              {searchTerm && <span>searching &quot;{searchTerm}&quot;</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});