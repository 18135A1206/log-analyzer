import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare, Clock, AlertTriangle, Info, Bug, Zap, Circle, Server } from 'lucide-react';
import { LogEntry, LogGroup, LogLevel } from '@/types/log';
import { Button } from './ui/Button';
import { formatTimestamp } from '@/utils/log-parser';

export interface LogEntryComponentProps {
  entry: LogEntry;
  onAddAnnotation?: (entryId: string, annotation: string) => void;
}

const getLevelIcon = (level: string) => {
  const iconClass = "w-4 h-4";
  switch (level.toUpperCase()) {
    case 'ERROR':
      return <AlertTriangle className={`${iconClass} text-red-400`} />;
    case 'WARN':
      return <AlertTriangle className={`${iconClass} text-yellow-400`} />;
    case 'INFO':
      return <Info className={`${iconClass} text-blue-400`} />;
    case 'DEBUG':
      return <Bug className={`${iconClass} text-gray-400`} />;
    case 'TRACE':
      return <Zap className={`${iconClass} text-purple-400`} />;
    default:
      return <Circle className={`${iconClass} text-gray-400`} />;
  }
};

/**
 * Get message text color based on log level
 */
const getMessageColor = (level: LogLevel): string => {
  switch (level) {
    case 'error':
      return 'text-red-800';
    case 'warn':
      return 'text-amber-800';
    case 'info':
      return 'text-blue-800';
    case 'debug':
      return 'text-gray-800';
    case 'trace':
      return 'text-purple-800';
    default:
      return 'text-gray-900';
  }
};

const getLevelColors = (level: string) => {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        badge: 'bg-red-600',
        text: 'text-red-600'
      };
    case 'WARN':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        badge: 'bg-yellow-600',
        text: 'text-yellow-600'
      };
    case 'INFO':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-blue-600',
        text: 'text-blue-600'
      };
    case 'DEBUG':
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        badge: 'bg-gray-600',
        text: 'text-gray-600'
      };
    case 'TRACE':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'bg-purple-600',
        text: 'text-purple-600'
      };
    default:
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        badge: 'bg-gray-500',
        text: 'text-gray-500'
      };
  }
};

/**
 * Individual log entry component with modern styling
 */
export const LogEntryComponent: React.FC<LogEntryComponentProps> = ({
  entry,
  onAddAnnotation
}) => {
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [isExpanded] = useState(true);

  const colors = getLevelColors(entry.level);

  const handleAnnotate = () => {
    if (annotationText.trim() && onAddAnnotation) {
      onAddAnnotation(entry.id, annotationText.trim());
      setAnnotationText('');
      setShowAnnotationForm(false);
    }
  };

  const shouldTruncateMessage = entry.message.length > 150;
  let displayMessage = entry.message;
  if (!isExpanded && shouldTruncateMessage) {
    displayMessage = `${entry.message.substring(0, 150)}...`;
  }

  return (
    <div className={`border rounded-lg transition-all duration-200 hover:shadow-md ${colors.bg} ${colors.border} mb-2 font-mono`}>
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {/* Level badge */}
            <div className={`inline-flex items-center px-2 py-1 rounded ${colors.badge}`}>
              {getLevelIcon(entry.level)}
              <span className="ml-1 text-xs font-bold text-white uppercase tracking-wide">
                {entry.level}
              </span>
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span className="font-mono font-semibold">{formatTimestamp(entry.timestamp)}</span>
          </div>
        </div>

        {/* Source */}
        {entry.source && (
          <div className="flex items-center space-x-2 mb-2">
            <Server className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-700 font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
              {entry.source}
            </span>
          </div>
        )}

        {/* Message */}
        <div className="space-y-1">
          <p className={`text-sm leading-relaxed font-mono font-medium break-words ${getMessageColor(entry.level)}`}>
            {displayMessage}
          </p>
        </div>

        {/* Existing Annotations */}
        {entry.annotations && entry.annotations.length > 0 && (
          <div className="mt-2 space-y-1">
            {entry.annotations.map((annotation, index) => (
              <div
                key={`${entry.id}-annotation-${index}`}
                className="p-2 bg-amber-50 border border-amber-300 rounded-lg"
              >
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-3 h-3 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-amber-800 leading-relaxed font-medium">{annotation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Annotation Form */}
        {showAnnotationForm && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-300 rounded-lg">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Add a note about this log entry..."
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                className="w-full bg-white border border-blue-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm transition-all duration-200 font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAnnotate();
                  } else if (e.key === 'Escape') {
                    setShowAnnotationForm(false);
                    setAnnotationText('');
                  }
                }}
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={handleAnnotate}
                  disabled={!annotationText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Add Note
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowAnnotationForm(false);
                    setAnnotationText('');
                  }}
                  style={{color: 'black'}}
                  className="border-gray-300 text-black hover:bg-gray-50 bg-white font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!showAnnotationForm && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => setShowAnnotationForm(true)}
              className="inline-flex items-center space-x-1 px-2 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-all duration-200 group font-semibold"
            >
              <MessageSquare className="w-3 h-3 group-hover:scale-110 transition-transform" />
              <span>Add Note</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export interface LogGroupComponentProps {
  group: LogGroup;
  onToggleExpanded: (groupId: string) => void;
  onAddAnnotation?: (entryId: string, annotation: string) => void;
}

/**
 * Grouped log entries component with modern styling
 */
export const LogGroupComponent: React.FC<LogGroupComponentProps> = ({
  group,
  onToggleExpanded,
  onAddAnnotation,
}) => {
  const colors = getLevelColors(group.level);

  return (
    <div className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg ${colors.bg} ${colors.border} mb-4`}>
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
      
      <button
        type="button"
        className="relative flex items-center justify-between p-4 w-full text-left transition-all duration-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1"
        onClick={() => onToggleExpanded(group.id)}
        aria-expanded={group.isExpanded}
        aria-label={`Toggle group with ${group.count} ${group.level} messages`}
      >
        <div className="flex items-center space-x-4">
          {/* Expand/Collapse Icon */}
          <div className="bg-white/10 rounded-lg p-1.5 border border-white/20">
            {group.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-white" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Level badge */}
          <div className={`inline-flex items-center px-2.5 py-1 rounded-lg ${colors.badge} shadow-lg`}>
            {getLevelIcon(group.level)}
            <span className="ml-1.5 text-xs font-bold text-white uppercase tracking-wide">
              {group.level}
            </span>
          </div>
          
          {/* Count badge */}
          <div className="bg-white/15 border border-white/30 rounded-lg px-3 py-1">
            <span className="text-xs font-medium text-white">
              {group.count} occurrences
            </span>
          </div>
        </div>
        
        {/* Timestamp range */}
        <div className="flex items-center text-xs text-gray-400 space-x-2">
          <Clock className="w-3 h-3" />
          <span className="font-mono">
            {formatTimestamp(group.entries[0].timestamp)}
            {group.count > 1 && (
              <span className="mx-2 text-gray-500">→</span>
            )}
            {group.count > 1 && formatTimestamp(group.entries[group.entries.length - 1].timestamp)}
          </span>
        </div>
      </button>
      
      {/* Message preview */}
      <div className="px-4 pb-4">
        <div className="bg-black/20 rounded-lg p-3 border border-white/10">
          <p className="text-sm font-mono text-white leading-relaxed break-words">
            {group.message.length > 200 ? `${group.message.substring(0, 200)}...` : group.message}
          </p>
        </div>
      </div>

      {/* Expanded entries */}
      {group.isExpanded && (
        <div className="border-t border-white/20 bg-black/20">
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">
                Individual Entries
              </span>
            </div>
            
            {group.entries.map((entry, index) => (
              <div key={entry.id} className={index > 0 ? 'border-t border-white/10 pt-3' : ''}>
                <LogEntryComponent entry={entry} onAddAnnotation={onAddAnnotation} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};