import React from 'react';
import { FileText } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { FileUpload } from './ui/FileUpload';
import { LogSummary } from './LogSummary';
import { LogControls } from './LogControls';
import { LogViewer } from './LogViewer';
import { ScrollToTop } from './ScrollToTop';
import { useLogViewer } from '../hooks/useLogViewer';
import { filterLogEntries } from '@/utils/log-parser';

/**
 * Main Log Viewer Application component
 */
export const LogViewerApp: React.FC = () => {
  const {
    logFile,
    search,
    selectedLevels,
    isLoading,
    handleFileUpload,
    setSearch,
    setSelectedLevels,
    annotateEntry,
    clearLog,
  } = useLogViewer();

  // Calculate filtered entries for display
  const filteredEntries = logFile ? filterLogEntries(logFile.entries, {
    search: search || undefined,
    levels: selectedLevels.length > 0 ? selectedLevels : undefined
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-mono">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascade Code", "Roboto Mono", Menlo, "DejaVu Sans Mono", "Liberation Mono", "Consolas", "Ubuntu Mono", "Courier New", monospace',
            fontSize: '13px',
            fontWeight: '500',
          },
        }}
      />

      {/* Clean Header */}
            <header className="bg-white border-b border-gray-300 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Log Viewer</h1>
                <p className="text-xs text-gray-600 font-medium">Advanced log analysis tool</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {!logFile ? (
          /* Clean Upload Section */
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="bg-gray-900 p-4 rounded-lg inline-block">
                <FileText className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-3">
                Log Analysis Tool
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                Upload and analyze log files with clean filtering and search capabilities.
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-gray-100 rounded-lg border border-gray-300 p-6 shadow-sm">
              <FileUpload
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
                acceptedTypes=".txt,.log,.out"
                maxSize={100 * 1024 * 1024} // 100MB
                className="border-dashed border-2 border-white/20 hover:border-blue-400/50 transition-all duration-300"
              />
            </div>
            
            {/* Features Grid */}
            {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: "🎨", 
                  title: "Color-coded Levels", 
                  desc: "Visual log level identification",
                  gradient: "from-red-500 to-orange-500"
                },
                { 
                  icon: "🔍", 
                  title: "Real-time Search", 
                  desc: "Instant log message filtering",
                  gradient: "from-blue-500 to-cyan-500"
                },
                { 
                  icon: "📊", 
                  title: "Smart Analytics", 
                  desc: "Automated pattern detection",
                  gradient: "from-purple-500 to-pink-500"
                },
                { 
                  icon: "⚡", 
                  title: "Lightning Fast", 
                  desc: "Handle massive log files",
                  gradient: "from-green-500 to-emerald-500"
                },
              ].map((feature) => (
                <div 
                  key={feature.title} 
                  className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div> */}
          </div>
        ) : (
          /* Modern Analysis Section */
          <div className="space-y-4">
            {/* Modern Log Summary */}
            <LogSummary summary={logFile.summary} />

            {/* Controls */}
            <LogControls
              searchTerm={search}
              onSearchChange={setSearch}
              selectedFilters={selectedLevels}
              onFilterChange={setSelectedLevels}
              onClearLogs={clearLog}
              totalEntries={logFile.entries.length}
              filteredEntries={filteredEntries.length}
            />

            {/* Log Viewer */}
            <LogViewer
              entries={filteredEntries}
              onAddAnnotation={annotateEntry}
            />
          </div>
        )}
      </main>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};