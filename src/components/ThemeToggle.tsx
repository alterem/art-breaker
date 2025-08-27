import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  onThemeToggle?: (event: React.MouseEvent, newTheme: 'light' | 'dark') => void;
}

export function ThemeToggle({ onThemeToggle }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-3 w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  // 获取下一个主题 - 修复循环逻辑
  const getNextTheme = () => {
    if (theme === 'system') {
      return 'light';
    } else if (theme === 'light') {
      return 'dark';
    } else {
      return 'system';
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    const nextTheme = getNextTheme();

    // 先触发波纹动画
    if (onThemeToggle) {
      // 当切换到系统主题时，需要根据当前系统主题决定波纹颜色
      let rippleTheme: 'light' | 'dark';
      
      if (nextTheme === 'system') {
        // 如果要切换到系统主题，检查系统当前的主题偏好
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        rippleTheme = systemPrefersDark ? 'dark' : 'light';
      } else {
        rippleTheme = nextTheme as 'light' | 'dark';
      }
      
      onThemeToggle(event, rippleTheme);
    }

    // 等待波纹动画开始扩散再切换主题（让波纹有时间展示）
    setTimeout(() => {
      setTheme(nextTheme);
    }, 400); // 波纹扩散到一定程度时切换
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative p-3 rounded-xl overflow-hidden
        bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800
        border border-gray-300 dark:border-gray-600
        shadow-lg hover:shadow-xl dark:shadow-gray-900/30
        transform hover:scale-110 active:scale-95
        transition-all duration-300 ease-out
      `}
      aria-label={`切换主题 (当前: ${theme === 'system' ? '跟随系统' : theme === 'dark' ? '暗色' : '亮色'})`}
      title={`当前：${theme === 'system' ? '跟随系统' : theme === 'dark' ? '暗色' : '亮色'}模式`}
    >
      {/* 背景光晕效果 */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${isDark 
          ? 'bg-gradient-to-br from-yellow-200/30 to-orange-200/30' 
          : 'bg-gradient-to-br from-blue-200/30 to-indigo-200/30'
        }
      `} />

      {/* 图标容器 */}
      <div className="relative w-5 h-5">
        {/* 系统主题图标 */}
        <Monitor
          className={`
            absolute inset-0 w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-500 ease-in-out
            ${theme === 'system'
              ? 'opacity-100 scale-100 rotate-0 translate-y-0'
              : 'opacity-0 scale-75 rotate-90 translate-y-2'
            }
          `}
        />

        {/* 太阳图标 */}
        <Sun
          className={`
            absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-500 ease-in-out
            ${theme === 'dark' 
              ? 'opacity-100 scale-100 rotate-0 translate-y-0' 
              : 'opacity-0 scale-75 rotate-90 translate-y-2'
            }
          `}
        />

        {/* 月亮图标 */}
        <Moon
          className={`
            absolute inset-0 w-5 h-5 text-blue-600 dark:text-blue-400 transition-all duration-500 ease-in-out
            ${theme === 'light' 
              ? 'opacity-100 scale-100 rotate-0 translate-y-0' 
              : 'opacity-0 scale-75 rotate-90 -translate-y-2'
            }
          `}
        />
      </div>
    </button>
  );
}
