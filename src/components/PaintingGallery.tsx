import React from 'react';
import { paintings, type Painting } from '../data/paintings';
import { UploadedImage } from '../hooks/useImageUpload';
import { ImageUploadZone } from './ImageUploadZone';
import { cn } from '../lib/utils';

interface PaintingGalleryProps {
  selectedPainting: string | null;
  onSelectPainting: (painting: Painting | UploadedImage) => void;
  uploadedImages: UploadedImage[];
  onUpload: (file: File) => Promise<UploadedImage | null>;
  onRemoveUpload: (id: string) => void;
  isUploading: boolean;
  uploadError: string | null;
  onClearUploadError: () => void;
}

export const PaintingGallery: React.FC<PaintingGalleryProps> = ({
  selectedPainting,
  onSelectPainting,
  uploadedImages,
  onUpload,
  onRemoveUpload,
  isUploading,
  uploadError,
  onClearUploadError
}) => {
  const allImages = [...paintings, ...uploadedImages.map(img => ({
    id: img.id,
    title: img.title,
    artist: '您的作品',
    filename: img.url,
    description: '用户上传的创作素材',
    period: '现代',
    isUploaded: true,
    uploadedImage: img
  }))];

  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gold-600 dark:text-gold-400 mb-2">原作画廊</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">选择名画或上传您的创作素材</p>
        
        <ImageUploadZone
          onUpload={onUpload}
          isUploading={isUploading}
          error={uploadError}
          onClearError={onClearUploadError}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 h-96 overflow-y-auto custom-scrollbar">
        {allImages.map((painting) => {
          const isSelected = selectedPainting === painting.filename;
          const isUploaded = 'isUploaded' in painting && painting.isUploaded;
          
          return (
            <div
              key={painting.id}
              className={cn(
                "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 simple-hover",
                isSelected
                  ? "border-gold-500 dark:border-gold-400 shadow-lg shadow-gold-500/20 dark:shadow-gold-400/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gold-500/50 dark:hover:border-gold-400/50"
              )}
              onClick={() => onSelectPainting(painting as any)}
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-700">
                <img
                  src={isUploaded ? painting.filename : `/images/paintings/${painting.filename}`}
                  alt={painting.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <h3 className="text-white text-xs font-medium truncate">{painting.title}</h3>
                <p className="text-gray-300 text-xs truncate">{painting.artist}</p>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-gold-500 dark:bg-gold-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {isUploaded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveUpload(painting.id);
                  }}
                  className="absolute top-2 left-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};