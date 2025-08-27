import { useState } from 'react';
import { FluxKontextAPI, type TaskResponse } from '../services/FluxKontextAPI';

export interface GenerationRequest {
  selectedPainting: string;
  prompt: string;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}

export interface GenerationStatus {
  status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
}

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>({ status: 'idle' });

  const updateStatus = (newStatus: Partial<GenerationStatus>) => {
    setStatus(prev => ({ ...prev, ...newStatus }));
  };

  const generateImage = async (request: GenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    updateStatus({ status: 'pending', message: '正在提交生成任务...' });

    try {
      const api = new FluxKontextAPI(); // 不再需要传入apiKey

      // 构建图像生成请求（使用正确的参数）
      const imageRequest = {
        inputImage: request.selectedPainting.startsWith('http')
          ? request.selectedPainting
          : `${window.location.origin}/images/paintings/${request.selectedPainting}`,
        prompt: request.prompt,
        model: 'flux-kontext-pro',
        enableTranslation: true,
        outputFormat: 'jpeg'
      };

      // 进度回调函数
      const onProgress = (taskStatus: TaskResponse) => {
        switch (taskStatus.status) {
          case 'pending':
            updateStatus({
              status: 'pending',
              message: '任务已提交，等待处理中...',
              progress: 10
            });
            break;
          case 'processing':
            updateStatus({
              status: 'processing',
              message: 'AI正在创作您的杰作...',
              progress: taskStatus.progress || 50
            });
            break;
          case 'completed':
            updateStatus({
              status: 'completed',
              message: '生成完成！',
              progress: 100
            });
            break;
          case 'failed':
            updateStatus({
              status: 'failed',
              message: taskStatus.error || '生成失败，请尝试调整您的提示词后重试'
            });
            break;
        }
      };

      // 开始生成
      const imageUrl = await api.generateImage(imageRequest, onProgress);

      const generationResult: GenerationResult = {
        imageUrl,
        timestamp: Date.now()
      };

      setResult(generationResult);
      updateStatus({ status: 'completed', message: '生成成功！' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成图像时发生错误，请尝试调整您的提示词后重试';
      setError(errorMessage);
      updateStatus({ status: 'failed', message: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setIsGenerating(false);
    setStatus({ status: 'idle' });
  };

  return {
    generateImage,
    isGenerating,
    result,
    error,
    status,
    reset
  };
};
