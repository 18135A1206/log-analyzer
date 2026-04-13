import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FileUploadProps {
  onFileUpload: (file: File, content: string) => Promise<void> | void;
  acceptedTypes?: string;
  maxSize?: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * File upload component with drag and drop support
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  acceptedTypes = '.txt,.log',
  maxSize = 50 * 1024 * 1024, // 50MB
  isLoading = false,
  className,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    // Prevent double uploads
    if (isProcessing || isLoading) {
      console.log('Upload already in progress, ignoring duplicate attempt');
      return;
    }

    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    console.log('Starting file upload:', file.name);
    setIsProcessing(true);
    
    try {
      console.log('Reading file content...');
      const content = await file.text();
      console.log('File content read, calling onFileUpload');
      
      // Call the upload handler and wait for completion
      await onFileUpload(file, content);
      console.log('File upload completed successfully');
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [maxSize, onFileUpload, isLoading, isProcessing]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isProcessing || isLoading) {
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  }, [handleFile, isProcessing, isLoading]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing && !isLoading) {
      setIsDragOver(true);
    }
  }, [isProcessing, isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
    // Reset the input value to allow same file upload
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFile]);

  const openFileDialog = useCallback(() => {
    if (isProcessing || isLoading) {
      console.log('Upload in progress, preventing dialog');
      return;
    }
    fileInputRef.current?.click();
  }, [isProcessing, isLoading]);

  const uploadInProgress = isLoading || isProcessing;

  return (
    <button
      type="button"
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 w-full text-left font-mono',
        'focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600',
        'hover:border-gray-500 hover:bg-gray-200',
        isDragOver && 'border-gray-600 bg-gray-200',
        'border-gray-400 bg-gray-100',
        uploadInProgress && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={openFileDialog}
      aria-label="Upload log file"
      disabled={uploadInProgress}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploadInProgress}
      />

      <div className="text-center space-y-4">
        <div className="bg-gray-200 p-4 rounded-lg inline-block">
          {uploadInProgress ? (
            <div className="w-10 h-10 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-gray-700" />
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {uploadInProgress ? 'Processing your file...' : 'Drop your log files here'}
          </h3>
          <p className="text-gray-700 mb-4 text-base font-medium">
            {uploadInProgress 
              ? 'Analyzing log structure and parsing entries...' 
              : 'Drag and drop your log file here, or click to browse'
            }
          </p>
          {!uploadInProgress && (
            <div />
          )}
        </div>

        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
            <span className="font-semibold">Supports: {acceptedTypes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span className="font-semibold">Max size: {maxSize / (1024 * 1024)}MB</span>
          </div>
        </div>
      </div>
    </button>
  );
};