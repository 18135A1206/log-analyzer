import { LogEntry, LogLevel, LogSummary, ParsedLogFile, LogGroup } from '@/types/log';
import { format } from 'date-fns';

/**
 * Parse log file content and extract log entries
 */
export function parseLogFile(content: string, fileName: string, fileSize: number): ParsedLogFile {
  const lines = content.split('\n').filter(line => line.trim());
  const entries: LogEntry[] = [];

  lines.forEach((line, index) => {
    const entry = parseLogLine(line, index);
    if (entry) {
      entries.push(entry);
    }
  });

  const summary = calculateLogSummary(entries);

  return {
    name: fileName,
    size: fileSize,
    entries,
    summary,
  };
}

/**
 * Parse a single log line into a LogEntry
 */
function parseLogLine(line: string, index: number): LogEntry | null {
  if (!line.trim()) return null;

  // Common log patterns (simplified for complexity reduction)
  const patterns = [
    // ISO timestamp with level (your log format: 2025-07-07T12:14:24.476751Z INFO q2_sdk.general)
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{6})?Z)\s+(\w+)\s+(.+)$/,
    // ISO timestamp with bracketed level
    /^(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d{3})?)\s*\[(\w+)\]\s*(.+)$/,
    // Simple timestamp
    /^(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})\s*\[?(\w+)\]?\s*(.+)$/,
    // Level at start
    /^(\w+):\s*(.+)$/,
    // No timestamp, just message
    /^(.+)$/,
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      let timestamp = new Date();
      let level: LogLevel = 'info';
      let message = '';

      if (match.length === 4) {
        // Full pattern with timestamp and level
        timestamp = parseTimestamp(match[1]);
        const levelStr = match[2];
        if (levelStr) {
          level = parseLogLevel(levelStr);
        }
        message = match[3];
      } else if (match.length === 3 && match[0].includes(':')) {
        // Level and message
        const levelStr = match[1];
        if (levelStr) {
          level = parseLogLevel(levelStr);
        }
        message = match[2];
      } else {
        // Just message
        message = match[1] || line;
        level = detectLogLevel(message);
      }

      return {
        id: `log-${index}`,
        timestamp,
        level,
        message: message.trim(),
        source: extractSource(message),
        metadata: {},
        annotations: [],
      };
    }
  }

  return null;
}

/**
 * Parse timestamp string into Date object
 */
function parseTimestamp(timestampStr: string): Date {
  try {
    // Handle various timestamp formats
    const cleaned = timestampStr.replace(/[[\]]/g, '');
    const date = new Date(cleaned);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
}

/**
 * Parse log level string
 */
function parseLogLevel(levelStr: string): LogLevel {
  const level = levelStr.toLowerCase().trim();
  
  if (level.includes('error') || level.includes('err')) return 'error';
  if (level.includes('warn') || level.includes('warning')) return 'warn';
  if (level.includes('info') || level.includes('information')) return 'info';
  if (level.includes('debug') || level.includes('dbg')) return 'debug';
  if (level.includes('trace') || level.includes('trc')) return 'trace';
  
  return 'info';
}

/**
 * Detect log level from message content
 */
function detectLogLevel(message: string): LogLevel {
  const msg = message.toLowerCase();
  
  if (msg.includes('error') || msg.includes('exception') || msg.includes('fail')) return 'error';
  if (msg.includes('warn') || msg.includes('warning')) return 'warn';
  if (msg.includes('debug')) return 'debug';
  if (msg.includes('trace')) return 'trace';
  
  return 'info';
}

/**
 * Extract source information from log message
 */
function extractSource(message: string): string | undefined {
  // Look for common source patterns
  const sourcePatterns = [
    /\[([^\]]+)\]/,
    /(\w+\.\w+):/,
    /^(\w+):/,
  ];

  for (const pattern of sourcePatterns) {
    const match = pattern.exec(message);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

/**
 * Calculate summary statistics for log entries
 */
function calculateLogSummary(entries: LogEntry[]): LogSummary {
  const summary: LogSummary = {
    total: entries.length,
    error: 0,
    warn: 0,
    info: 0,
    debug: 0,
    trace: 0,
  };

  entries.forEach(entry => {
    summary[entry.level]++;
  });

  return summary;
}

/**
 * Group similar log entries together
 */
export function groupLogEntries(entries: LogEntry[]): LogGroup[] {
  const groups = new Map<string, LogGroup>();

  entries.forEach(entry => {
    const key = generateGroupKey(entry);
    
    if (groups.has(key)) {
      const group = groups.get(key)!;
      group.count++;
      group.entries.push(entry);
    } else {
      groups.set(key, {
        id: `group-${groups.size}`,
        message: entry.message,
        level: entry.level,
        count: 1,
        entries: [entry],
        isExpanded: false,
      });
    }
  });

  return Array.from(groups.values())
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate a key for grouping similar log entries
 */
function generateGroupKey(entry: LogEntry): string {
  // Normalize the message by removing dynamic parts
  const normalized = entry.message
    .replace(/\d{4}-\d{2}-\d{2}/g, 'DATE')
    .replace(/\d{2}:\d{2}:\d{2}/g, 'TIME')
    .replace(/\b\d+\b/g, 'NUMBER')
    .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, 'UUID')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, 'IP');

  return `${entry.level}:${normalized}`;
}

/**
 * Filter log entries based on criteria
 */
export function filterLogEntries(entries: LogEntry[], filter: {
  search?: string;
  levels?: LogLevel[];
  dateRange?: { start: Date; end: Date };
}): LogEntry[] {
  return entries.filter(entry => {
    // Search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      if (!entry.message.toLowerCase().includes(searchTerm) &&
          !entry.source?.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Level filter
    if (filter.levels && filter.levels.length > 0) {
      if (!filter.levels.includes(entry.level)) {
        return false;
      }
    }

    // Date range filter
    if (filter.dateRange) {
      if (entry.timestamp < filter.dateRange.start ||
          entry.timestamp > filter.dateRange.end) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: Date): string {
  return format(timestamp, 'yyyy-MM-dd HH:mm:ss.SSS');
}

/**
 * Get color class for log level
 */
export function getLogLevelColor(level: LogLevel): string {
  switch (level) {
    case 'error': return 'text-red-500';
    case 'warn': return 'text-yellow-500';
    case 'info': return 'text-blue-500';
    case 'debug': return 'text-gray-500';
    case 'trace': return 'text-purple-500';
    default: return 'text-gray-500';
  }
}

/**
 * Get background color class for log level
 */
export function getLogLevelBgColor(level: LogLevel): string {
  switch (level) {
    case 'error': return 'bg-red-50 dark:bg-red-900/20';
    case 'warn': return 'bg-yellow-50 dark:bg-yellow-900/20';
    case 'info': return 'bg-blue-50 dark:bg-blue-900/20';
    case 'debug': return 'bg-gray-50 dark:bg-gray-900/20';
    case 'trace': return 'bg-purple-50 dark:bg-purple-900/20';
    default: return 'bg-gray-50 dark:bg-gray-900/20';
  }
}