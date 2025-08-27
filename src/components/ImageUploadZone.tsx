import React, { useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { UploadedImage } from '../hooks/useImageUpload';

interface ImageUploadZoneProps {
  onUpload: (file: File) => Promise<UploadedImage | null>;
  isUploading: boolean;
  error: string | null;
  onClearError: () => void;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onUpload,
  isUploading,
  error,
  onClearError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    onClearError();
    await onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="mb-4">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
          "bg-gray-50 dark:bg-gray-700/50",
          isDragOver
            ? "border-gold-500 dark:border-gold-400 bg-gold-500/10 dark:bg-gold-400/10"
            : "border-gray-300 dark:border-gray-600 hover:border-gold-500/70 dark:hover:border-gold-400/70",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-gold-500 dark:bg-gold-500 rounded-full flex items-center justify-center">
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isUploading ? '正在上传...' : '上传您的图片'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              拖拽文件或点击选择 • JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-300 text-sm">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={onClearError}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};