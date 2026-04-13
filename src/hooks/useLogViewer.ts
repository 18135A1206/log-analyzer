import { useState, useCallback } from 'react';
import { LogLevel, ParsedLogFile } from '@/types/log';
import { parseLogFile } from '@/utils/log-parser';
import toast from 'react-hot-toast';

export interface UseLogViewerState {
  logFile: ParsedLogFile | null;
  search: string;
  selectedLevels: LogLevel[];
  isLoading: boolean;
}

export interface UseLogViewerActions {
  handleFileUpload: (file: File, content: string) => Promise<void>;
  setSearch: (search: string) => void;
  setSelectedLevels: (levels: LogLevel[]) => void;
  annotateEntry: (entryId: string, annotation: string) => void;
  clearLog: () => void;
}

/**
 * Custom hook for managing log viewer state and actions
 */
export function useLogViewer(): UseLogViewerState & UseLogViewerActions {
  const [logFile, setLogFile] = useState<ParsedLogFile | null>(null);
  const [search, setSearch] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<LogLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback(async (file: File, content: string) => {
    console.log('File upload started:', file.name, 'Size:', file.size);
    setIsLoading(true);
    
    // Add a small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      console.log('Parsing log file...');
      const parsedLog = parseLogFile(content, file.name, file.size);
      
      if (parsedLog.entries.length === 0) {
        console.log('No entries found in parsed log');
        toast.error('No valid log entries found in the file. Please check the format and try again.');
        return;
      }
      
      console.log('Successfully parsed', parsedLog.entries.length, 'entries');
      setLogFile(parsedLog);
      
      // Reset filters when new file is loaded
      setSearch('');
      setSelectedLevels([]);
      
      toast.success(`Successfully loaded ${parsedLog.entries.length} log entries from ${file.name}`);
    } catch (error) {
      console.error('Error parsing log file:', error);
      toast.error('Failed to parse log file. Please check the format and try again.');
    } finally {
      console.log('File upload completed');
      setIsLoading(false);
    }
  }, []);

  const annotateEntry = useCallback((entryId: string, annotation: string) => {
    if (!logFile) return;

    const updatedEntries = logFile.entries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          annotations: [...(entry.annotations || []), annotation],
        };
      }
      return entry;
    });

    setLogFile({
      ...logFile,
      entries: updatedEntries,
    });

    toast.success('Annotation added successfully');
  }, [logFile]);

  const clearLog = useCallback(() => {
    setLogFile(null);
    setSearch('');
    setSelectedLevels([]);
    toast.success('Log cleared');
  }, []);

  return {
    logFile,
    search,
    selectedLevels,
    isLoading,
    handleFileUpload,
    setSearch,
    setSelectedLevels,
    annotateEntry,
    clearLog,
  };
}