import React, { useState, useEffect } from 'react';
import { GenerationResult, GenerationStatus } from '../hooks/useImageGeneration';
import { cn } from '../lib/utils';

interface GenerationResultProps {
  result: GenerationResult | null;
  isGenerating: boolean;
  error: string | null;
  status: GenerationStatus;
  onDownload?: (success: boolean) => void;
  onShare?: (success: boolean) => void;
  onReset?: () => void;
}

const loadingMessages = [
  "🎨 AI正在精心绘制...",
  "✨ 创意灵感正在迫降...",
  "🔮 艺术魔法正在发生...",
  "🎆 视觉奇迹即将诞生..."
];

export const GenerationResultComponent: React.FC<GenerationResultProps> = ({
  result,
  isGenerating,
  error,
  status,
  onDownload,
  onShare,
  onReset
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (isGenerating && status.status !== 'processing') {
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 2000);

      return () => {
        clearInterval(messageInterval);
      };
    } else {
      setCurrentMessageIndex(0);
    }
  }, [isGenerating, status.status]);

  // ESC键关闭模态框
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isImageModalOpen) {
        setIsImageModalOpen(false);
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);

  const handleDownload = async () => {
    if (result && onDownload) {
      try {
        // 创建一个 canvas 来绘制图片，然后下载
        const img = new Image();
        img.crossOrigin = 'anonymous'; // 允许跨域
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            ctx?.drawImage(img, 0, 0);
            
            // 将 canvas 转换为 blob 并下载
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `artbreaker-creation-${result.timestamp}.jpg`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                onDownload(true);
              } else {
                onDownload(false);
              }
            }, 'image/jpeg', 0.9);
          } catch (canvasError) {
            console.error('Canvas download failed:', canvasError);
            // 降级到直接链接方式
            const link = document.createElement('a');
            link.href = result.imageUrl;
            link.download = `artbreaker-creation-${result.timestamp}.jpg`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onDownload(false);
          }
        };
        
        img.onerror = () => {
          console.error('Image load failed, using direct link');
          // 如果图片加载失败，使用直接链接
          const link = document.createElement('a');
          link.href = result.imageUrl;
          link.download = `artbreaker-creation-${result.timestamp}.jpg`;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          onDownload(false);
        };
        
        img.src = result.imageUrl;
      } catch (error) {
        console.error('Download setup failed:', error);
        onDownload(false);
      }
    }
  };

  const handleShare = async () => {
    if (onShare && result) {
      const text = "🎨 我在 ArtBreaker 上创作了一幅令人惊叹的艺术杰作！";
      const shareText = `${text} ${result.imageUrl}`;
      
      try {
        await navigator.clipboard.writeText(shareText);
        onShare(true);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        // 降级到手动选择文本
        try {
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const success = document.execCommand('copy');
          document.body.removeChild(textArea);
          onShare(success);
        } catch (fallbackErr) {
          console.error('Fallback copy also failed:', fallbackErr);
          onShare(false);
        }
      }
    }
  };

  const getProgressPercentage = () => {
    if (status.progress !== undefined) {
      return status.progress;
    }
    
    switch (status.status) {
      case 'pending': return 10;
      case 'processing': return 50;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const getStatusMessage = () => {
    if (status.message) {
      return status.message;
    }
    
    if (status.status === 'processing') {
      return 'AI正在创作您的杰作...';
    }
    
    return loadingMessages[currentMessageIndex];
  };

  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gold-600 dark:text-gold-400 mb-2">杰作诞生区</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">您的AI艺术创作将在这里展现</p>
      </div>
      
      <div className="h-96 flex flex-col justify-center">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 border-4 border-gold-500/30 dark:border-gold-400/30 border-t-gold-500 dark:border-t-gold-400 rounded-full animate-spin" />
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {getStatusMessage()}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {status.status === 'pending' && '正在连接服务器...'}
                {status.status === 'processing' && '请稍候，神奇即将发生'}
                {status.status === 'idle' && '准备开始生成'}
              </p>
            </div>
            
            <div className="w-48">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>进度</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-gold-500 to-gold-600 dark:from-gold-400 dark:to-gold-600 h-2 rounded-full transition-all duration-500"
                  style={{width: `${getProgressPercentage()}%`}}
                />
              </div>
            </div>
            
            {status.status === 'processing' && (
              <div className="text-xs text-gray-600 dark:text-gray-500 max-w-xs">
                这是真实的AI生成过程，通常需要1-3分钟
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">创作遇到问题</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">{error}</p>
            </div>
            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                重新尝试
              </button>
            )}
          </div>
        )}
        
        {result && !isGenerating && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative w-full">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={result.imageUrl}
                  alt="Generated artwork"
                  className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setIsImageModalOpen(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              
              {/* 放大提示 */}
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs opacity-0 hover:opacity-100 transition-opacity">
                点击放大
              </div>
            </div>
            
            {/* 图片放大模态框 */}
            {isImageModalOpen && (
              <div 
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                onClick={() => setIsImageModalOpen(false)}
              >
                <div className="relative max-w-[90vw] max-h-[90vh]">
                  <img
                    src={result.imageUrl}
                    alt="Generated artwork - Full size"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  {/* 关闭按钮 */}
                  <button
                    onClick={() => setIsImageModalOpen(false)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* 下载按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    className="absolute bottom-4 right-4 bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    下载
                  </button>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">🎉 您的AI杰作已完成！</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                生成时间：{new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 dark:bg-gold-500 dark:hover:bg-gold-600 text-black font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                下载
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                复制链接
              </button>
            </div>
            
            {onReset && (
              <button
                onClick={onReset}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
              >
                创作新作品
              </button>
            )}
          </div>
        )}
        
        {!result && !isGenerating && !error && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 mb-1">等待您的创作</h3>
              <p className="text-gray-500 dark:text-gray-500 text-sm">选择一幅画作，输入创意指令，然后点击生成按钮</p>
              <p className="text-gold-600 dark:text-gold-400 text-xs mt-2">✨ 真实FLUX.1-Kontext AI生成，无需API密钥</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};