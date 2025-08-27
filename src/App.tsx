import React, { useState } from 'react';
import { PaintingGallery } from './components/PaintingGallery';
import { CreativeInput } from './components/CreativeInput';
import { GenerationResultComponent } from './components/GenerationResult';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer, useToast } from './components/Toast';
import { useImageGeneration } from './hooks/useImageGeneration';
import { useImageUpload, UploadedImage } from './hooks/useImageUpload';
import { useThemeRipple } from './hooks/useThemeRipple';
import { type Painting } from './data/paintings';
import { cn } from './lib/utils';
import { useTheme } from 'next-themes';
import './index.css';

type SelectedItem = Painting | UploadedImage;

function App() {
  const [selectedPainting, setSelectedPainting] = useState<SelectedItem | null>(null);
  const [prompt, setPrompt] = useState('');
  const { theme } = useTheme();
  const { createRipple, RippleContainer } = useThemeRipple();
  const { messages, removeToast, showSuccess, showError } = useToast();

  const {
    generateImage,
    isGenerating,
    result,
    error,
    status,
    reset
  } = useImageGeneration();
  const {
    uploadedImages,
    uploadImage,
    removeImage,
    isUploading,
    error: uploadError,
    clearError
  } = useImageUpload();

  // 处理主题切换与波纹动画
  const handleThemeToggle = (event: React.MouseEvent, newTheme: 'light' | 'dark') => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createRipple({ x, y, targetTheme: newTheme });
  };

  const handleSelectPainting = (painting: SelectedItem) => {
    setSelectedPainting(painting);
  };

  const handleGenerate = async () => {
    if (!selectedPainting || !prompt.trim()) {
      return;
    }

    const filename = 'url' in selectedPainting ? selectedPainting.url : selectedPainting.filename;

    await generateImage({
      selectedPainting: filename,
      prompt: prompt.trim()
    });
  };

  const canGenerate = selectedPainting && prompt.trim() && !isGenerating && !isUploading;
  const selectedFilename = selectedPainting ?
    ('url' in selectedPainting ? selectedPainting.url : selectedPainting.filename) : null;

  return (
    <>
      {/* 波纹动画容器 */}
      <RippleContainer />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        {/* 简化的头部 */}
        <header className="bg-white/40 dark:bg-black/40 backdrop-blur-sm border-b border-gold-500/20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent mb-2">
                  ArtBreaker
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Remix History. Create a Masterpiece.
                </p>
                <p className="text-sm text-gold-600 dark:text-gold-400 mt-1">
                  ✨ 支持真实的FLUX.1-Kontext AI生成，无需API密钥
                </p>
              </div>
              <div className="ml-4">
                <ThemeToggle onThemeToggle={handleThemeToggle} />
              </div>
            </div>
          </div>
        </header>

      {/* 主要内容区域 - 确保在视口内 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 三栏布局 - 使用简单的grid布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 第一栏：画廊 */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 layout-fix transition-colors duration-300">
            <PaintingGallery
              selectedPainting={selectedFilename}
              onSelectPainting={handleSelectPainting}
              uploadedImages={uploadedImages}
              onUpload={uploadImage}
              onRemoveUpload={removeImage}
              isUploading={isUploading}
              uploadError={uploadError}
              onClearUploadError={clearError}
            />
          </div>

          {/* 第二栏：创意输入 */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 layout-fix transition-colors duration-300">
            <CreativeInput
              prompt={prompt}
              onChange={setPrompt}
              disabled={isGenerating || isUploading}
            />
          </div>

          {/* 第三栏：结果展示 */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 layout-fix transition-colors duration-300">
            <GenerationResultComponent
              result={result}
              isGenerating={isGenerating}
              error={error}
              status={status}
              onDownload={(success) => {
                if (success) {
                  showSuccess('下载成功', '图片已保存到您的设备');
                } else {
                  showError('下载失败', '请检查网络连接或稍后重试');
                }
              }}
              onShare={(success) => {
                if (success) {
                  showSuccess('复制成功', '分享链接已复制到剪贴板');
                } else {
                  showError('复制失败', '请手动复制链接或检查浏览器设置');
                }
              }}
              onReset={reset}
            />
          </div>
        </div>

        {/* 生成按钮 - 确保在正确位置 */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={cn(
              "px-8 py-4 text-xl font-semibold rounded-xl transition-all duration-300",
              "bg-gradient-to-r from-gold-500 to-gold-600 text-black",
              "shadow-lg hover:shadow-xl",
              canGenerate
                ? "hover:scale-105 hover:from-gold-400 hover:to-gold-500"
                : "opacity-50 cursor-not-allowed",
              isGenerating && "animate-pulse"
            )}
          >
            {isGenerating ? '🎨 AI正在创作中...' : '🚀 生成我的搞怪杰作！'}
          </button>
        </div>

        {/* 状态信息 */}
        {selectedPainting && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              已选择：<span className="text-gold-600 dark:text-gold-400 font-medium">{selectedPainting.title}</span>
              {' by '}
              <span className="text-gray-500 dark:text-gray-400">{'artist' in selectedPainting ? selectedPainting.artist : '您的作品'}</span>
            </p>
          </div>
        )}
      </main>

      {/* Toast 容器 */}
      <ToastContainer messages={messages} onRemove={removeToast} />

      {/* 简化的底部 */}
      <footer className="mt-2 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Powered by FLUX.1-Kontext AI • 让艺术历史与现代创意完美融合
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}

export default App;
