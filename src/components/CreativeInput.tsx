import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface CreativeInputProps {
  prompt: string;
  onChange: (prompt: string) => void;
  disabled?: boolean;
}

const examplePrompts = [
  "使用赛博朋克风格，添加霓虹灯和飞行汽车",
  "转换为日式动漫风格，添加樱花和彩虹",
  "变成蒸汽朋克风格，加入齿轮和黔铜元素",
  "太空未来主题，添加星球和宇航员",
  "中国古典水墨风，加入山水云雾和仙鹤",
  "现代抽象艺术，使用几何图形和鲜艳色彩",
  "梵高风格的旋转星空，充满活力的笔触",
  "毕加索立体主义风格，分解重组人物形象",
  "莫奈印象派风格，光影斑驳的水面倒影",
  "达利超现实主义，融化的时钟和奇幻景象",
  "宫崎骏动画风格，治愈系的森林精灵世界",
  "漫威电影风格，英雄史诗般的战斗场面",
  "哥特式建筑风格，神秘的教堂和彩色玻璃",
  "北欧极简风格，纯净的雪景和现代建筑",
  "中世纪油画风格，富丽堂皇的宫廷场景",
  "波普艺术风格，明亮色彩和重复图案",
  "新艺术运动风格，优雅的曲线和花卉装饰",
  "巴洛克风格，戏剧性光影和华丽装饰",
  "包豪斯风格，简洁几何与功能主义设计",
  "艺术装饰风格，对称几何与奢华质感"
];

export const CreativeInput: React.FC<CreativeInputProps> = ({
  prompt,
  onChange,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleExampleClick = (example: string) => {
    onChange(example);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gold-600 dark:text-gold-400 mb-2">灵感注入台</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">释放您的想象力，创造独特艺术</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">创意指令</label>
            {prompt && (
              <button
                onClick={handleClear}
                disabled={disabled}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                清空
              </button>
            )}
          </div>

          <textarea
            value={prompt}
            onChange={(e) => onChange(e.target.value.slice(0, 500))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder="描述您想要的创意效果，例如：使用赛博朋克风格，添加霓虹灯和飞行汽车..."
            className={cn(
              "w-full h-24 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors",
              isFocused ? "border-gold-500 dark:border-gold-400" : "border-gray-300 dark:border-gray-600",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />

          <div className="text-right mt-1">
            <span className={cn(
              "text-xs",
              prompt.length > 450 ? "text-red-500 dark:text-red-400" : "text-gray-500"
            )}>
              {prompt.length}/500
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">灵感示例</h3>
          <div className="space-y-2 h-64 overflow-y-auto custom-scrollbar px-2 pt-1">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={disabled}
                className={cn(
                  "w-full text-left px-3 py-2 mx-1 rounded-lg text-sm transition-all duration-200",
                  "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600",
                  "hover:border-gold-500/50 dark:hover:border-gold-400/50 hover:shadow-md",
                  "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                  "hover:scale-[1.02] hover:-translate-y-0.5",
                  disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:translate-y-0"
                )}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gold-600 dark:text-gold-400 mb-2">💡 创作提示</h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 结合不同的艺术风格和主题元素</li>
            <li>• 添加具体的颜色、光线和氛围描述</li>
            <li>• 使用情感化的语言增强视觉冲击力</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
