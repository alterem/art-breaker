# 🎨 ArtBreaker

**Remix History. Create a Masterpiece.**

一个基于世界名画的AI艺术创作平台，用创意指令重新诠释经典艺术作品。

## ✨ 特性

- 🖼️ **经典画作画廊** - 精选世界名画作为创作基础
- 🎨 **AI艺术生成** - 基于FLUX.1-Kontext AI的真实图像生成
- 💡 **灵感注入** - 丰富的创意提示和风格示例
- 🌙 **智能主题** - 跟随系统偏好的亮色/暗色主题切换
- 🌊 **流畅动画** - 优雅的波纹扩散主题切换效果
- 📱 **响应式设计** - 完美适配各种设备屏幕
- 🔍 **图片预览** - 点击放大查看生成的艺术作品
- 📤 **便捷分享** - 一键下载和社交媒体分享

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

### 构建项目
```bash
pnpm build
```

### 预览构建
```bash
pnpm preview
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **UI组件**: Radix UI
- **主题管理**: next-themes
- **图标库**: Lucide React
- **代码规范**: ESLint

## 🎯 主要功能

### 🖼️ 画廊选择
- 内置精选世界名画
- 支持用户上传自定义图片
- 拖拽上传，支持多种图片格式

### 🎨 AI生成
- 真实的FLUX.1-Kontext AI引擎
- 无需API密钥，开箱即用
- 多样化的艺术风格转换

### 💫 用户体验
- 智能主题切换（跟随系统/手动切换）
- 波纹扩散动画效果
- 响应式三栏布局设计
- 图片点击放大功能

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── ThemeProvider.tsx    # 主题提供器
│   ├── ThemeToggle.tsx      # 主题切换按钮
│   ├── PaintingGallery.tsx  # 画作画廊
│   ├── CreativeInput.tsx    # 创意输入区
│   └── GenerationResult.tsx # 结果展示区
├── hooks/              # 自定义Hooks
│   ├── useImageGeneration.ts # 图像生成逻辑
│   ├── useImageUpload.ts    # 图片上传逻辑
│   └── useThemeRipple.ts    # 主题波纹动画
├── data/               # 数据文件
│   └── paintings.ts        # 画作数据
├── lib/                # 工具函数
│   └── utils.ts            # 通用工具
└── services/           # API服务
    └── FluxKontextAPI.ts   # AI生成API
```

## 🎨 主题系统

ArtBreaker 支持智能主题切换：

- 🌍 **系统模式** - 自动跟随系统偏好
- ☀️ **亮色模式** - 清新的白色背景配色
- 🌙 **暗色模式** - 优雅的深色背景配色

主题切换带有优美的波纹扩散动画，从点击位置开始向整个屏幕扩散。

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改善项目！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [FLUX.1-Kontext](https://flux-kontext.ai/) - 提供强大的AI图像生成能力
- [Tailwind CSS](https://tailwindcss.com/) - 优秀的CSS框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍的UI组件库
- [Lucide](https://lucide.dev/) - 美观的图标库

---

**让艺术历史与现代创意完美融合** ✨
