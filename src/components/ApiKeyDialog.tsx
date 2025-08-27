import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
  isValidating?: boolean;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isValidating = false
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  const handleClose = () => {
    setApiKey('');
    setShowKey(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gold-400 mb-2">🔑 输入API密钥</h2>
          <p className="text-gray-300 text-sm">
            请输入您的FLUX.1-Kontext API密钥以开始生成图像
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              API密钥
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入您的API密钥"
                className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none"
                disabled={isValidating}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isValidating}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
            <h4 className="text-sm font-medium text-gold-400 mb-2">💡 获取API密钥</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• 访问 api.kie.ai 注册账户</li>
              <li>• 在控制台中创建新的API密钥</li>
              <li>• 密钥仅在本次会话中存储，安全可靠</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isValidating}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim() || isValidating}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg font-medium transition-all",
                "bg-gradient-to-r from-gold-500 to-gold-600 text-black",
                "hover:from-gold-400 hover:to-gold-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isValidating && "animate-pulse"
              )}
            >
              {isValidating ? '验证中...' : '确认'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
