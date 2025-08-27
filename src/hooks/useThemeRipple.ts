import React, { useState, useCallback } from 'react';

interface RippleAnimationOptions {
  x: number;
  y: number;
  targetTheme: 'light' | 'dark';
}

interface Ripple {
  id: string;
  x: number;
  y: number;
  targetTheme: 'light' | 'dark';
}

export function useThemeRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = useCallback(({ x, y, targetTheme }: RippleAnimationOptions): void => {
    const id = `ripple-${Date.now()}-${Math.random()}`;
    const ripple: Ripple = { id, x, y, targetTheme };

    setRipples(prev => [...prev, ripple]);

    // 动画完成后移除波纹
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1600);
  }, []);

  const RippleContainer = useCallback(() => {
    if (ripples.length === 0) {
      return null;
    }

    return React.createElement('div', null,
      ripples.map(ripple => {
        // 安全地获取窗口尺寸
        const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

        // 计算波纹应该扩散到的最大尺寸（覆盖整个屏幕）
        const maxSize = Math.max(
          Math.sqrt(ripple.x * ripple.x + ripple.y * ripple.y),
          Math.sqrt((windowWidth - ripple.x) * (windowWidth - ripple.x) + ripple.y * ripple.y),
          Math.sqrt(ripple.x * ripple.x + (windowHeight - ripple.y) * (windowHeight - ripple.y)),
          Math.sqrt((windowWidth - ripple.x) * (windowWidth - ripple.x) + (windowHeight - ripple.y) * (windowHeight - ripple.y))
        ) * 2;

        return React.createElement('div', {
          key: ripple.id,
          className: `theme-ripple ${ripple.targetTheme} expanding`,
          style: {
            left: ripple.x - maxSize / 2,
            top: ripple.y - maxSize / 2,
            width: maxSize,
            height: maxSize,
          }
        });
      })
    );
  }, [ripples]);

  return {
    createRipple,
    RippleContainer,
  };
}
