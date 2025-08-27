import { useState, useCallback } from 'react';
import { FluxKontextAPI } from '../services/FluxKontextAPI';

export interface UploadedImage {
  id: string;
  file: File;
  url: string;  // 这里现在存储的是服务器返回的真实URL
  title: string;
  timestamp: number;
}

export const useImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<UploadedImage | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件格式。请上传 JPG、PNG 或 WEBP 格式的图片。');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('文件大小超出限制。请上传小于10MB的图片。');
      }

      // 使用FluxKontextAPI上传图片到服务器
      const api = new FluxKontextAPI();
      const serverUrl = await api.uploadImage(file);
      
      const uploadedImage: UploadedImage = {
        id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        url: serverUrl,  // 使用服务器返回的真实URL
        title: file.name.split('.')[0] || '用户上传',
        timestamp: Date.now()
      };

      setUploadedImages(prev => [...prev, uploadedImage]);
      return uploadedImage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传图片时发生错误';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      // 不再需要revoke URL，因为现在使用的是服务器URL
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadedImages,
    uploadImage,
    removeImage,
    isUploading,
    error,
    clearError
  };
};