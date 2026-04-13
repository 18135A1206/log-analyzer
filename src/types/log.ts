/**
 * Log entry types and interfaces for the Log Viewer application
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source?: string;
  metadata?: Record<string, unknown>;
  annotations?: string[];
}

export interface LogGroup {
  id: string;
  message: string;
  level: LogLevel;
  count: number;
  entries: LogEntry[];
  isExpanded: boolean;
}

export interface LogSummary {
  total: number;
  error: number;
  warn: number;
  info: number;
  debug: number;
  trace: number;
}

export interface LogFilter {
  search: string;
  levels: LogLevel[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  source?: string;
}

export interface ParsedLogFile {
  name: string;
  size: number;
  entries: LogEntry[];
  summary: LogSummary;
}