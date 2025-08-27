import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ message, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 进入动画
    setTimeout(() => setIsVisible(true), 50);

    // 自动移除
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(message.id), 300);
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, [message, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(message.id), 300);
  };

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getBorderColor = () => {
    switch (message.type) {
      case 'success': return 'border-green-200 dark:border-green-800';
      case 'error': return 'border-red-200 dark:border-red-800';
      case 'info':
      default: return 'border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div
      className={cn(
        "mb-3 mx-4 p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 transform",
        getBorderColor(),
        isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        "max-w-sm"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {message.title}
            </p>
            {message.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {message.description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Toast Container 组件
interface ToastContainerProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ messages, onRemove }) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {messages.map((message) => (
          <Toast
            key={message.id}
            message={message}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

// Toast Hook
export const useToast = () => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast: ToastMessage = {
      ...toast,
      id,
    };
    setMessages((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const showSuccess = (title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  };

  const showError = (title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  };

  const showInfo = (title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  };

  return {
    messages,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
  };
};