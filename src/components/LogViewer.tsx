import React, { memo } from 'react';
import { LogEntry } from '@/types/log';
import { LogEntryComponent } from './LogEntry';
import { FileText, Eye } from 'lucide-react';

export interface LogViewerProps {
  entries: LogEntry[];
  onAddAnnotation: (entryId: string, annotation: string) => void;
}

export const LogViewer: React.FC<LogViewerProps> = memo(function LogViewer({
  entries,
  onAddAnnotation
}) {
  if (entries.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
        <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Log Entries</h3>
        <p className="text-gray-500">
          No log entries match your current filters. Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-black p-2 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Log Entries</h2>
            <p className="text-sm text-gray-600">{entries.length} entries found</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {entries.map((entry) => (
          <LogEntryComponent 
            key={entry.id} 
            entry={entry} 
            onAddAnnotation={onAddAnnotation}
          />
        ))}
      </div>
    </div>
  );
});
