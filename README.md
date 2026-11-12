<p align="center">
  <img src="./assets/banner.png" alt="PicoView Banner" width="480" style="border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</p>

<h1 align="center">PicoView</h1>

<p align="center">
  <strong>轻巧、极速、现代的浏览器独立图片查看增强扩展</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue.svg" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Version-1.0.0-green.svg" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/Dependencies-None-brightgreen.svg" alt="Dependencies None" />
  <img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License MIT" />
</p>

---

## 📖 简介

在 Chromium 内核浏览器中，直接打开独立图片标签页时的默认体验往往过于简陋：缩放比例固定、不支持拖拽旋转、无法便捷检查透明底图或像素细节。

**PicoView** 是一款现代、优雅且零外部依赖的浏览器图片查看扩展（Chrome Extension Manifest V3）。它将单调的独立图片标签页升级为功能完备、交互丝滑的高性能图片查看台，无论日常浏览、摄影鉴赏、矢量图标审阅还是像素艺术分析，都能带来极其舒适的使用体验。

---

## ✨ 核心特性

- 🚀 **极速无负担**：完全采用原生 JavaScript 与 CSS 构建，零第三方依赖，加载迅速，内存占用极低。
- 🔍 **无级平滑缩放**：支持以鼠标指针为锚点进行超高倍率缩放（支持 2% ~ 4000%），细微瑕疵与宏观全局尽收眼底。
- 🖐️ **自由平移漫游**：按住鼠标左键即可随意拖拽图片在视野内平移，支持惯性与窗口边缘约束。
- 🔄 **旋转与镜像翻转**：支持顺时针/逆时针 90° 旋转，并提供水平（H）与垂直（V）镜像翻转功能。
- 🏁 **透明网格背景**：针对透明 PNG、WebP 及 SVG 矢量图，一键切换黑白相间的经典透明棋盘格背景。
- 👾 **像素化模式 (Pixelated)**：专为像素艺术与小尺寸 Icon 优化，一键关闭抗锯齿线性插值，显示锐利、无模糊的原始像素颗粒。
- 🎨 **沉浸式视觉底色**：
  - 支持纯色背景，位图与 SVG 底色可独立调配。
  - 支持当前图片色彩自适应提取并生成毛玻璃高斯模糊背景。
- ⚡ **深思熟虑的交互细节**：
  - SVG 专属独立着色底板，告别深色模式下透明黑色矢量图无法辨识的困扰。
  - 网页图片右键快捷菜单：“在当前标签页打开图片”。
  - 完善的键盘无障碍支持与屏幕阅读器实时状态播报。
- 🛠️ **全方位个性化定制**：所有快捷键均支持图形化录制与清除，滚轮方向与行为皆可灵活反转。

---

## ⌨️ 操作与快捷键指南

所有快捷键均可在扩展设置页面自由更改或禁用。以下为默认键位：

| 快捷键 / 鼠标操作 | 功能说明 |
| :--- | :--- |
| **滚轮滚动** | 以鼠标位置为中心平滑缩放（默认模式） |
| **Ctrl + 滚轮** | 垂直滚动平移视图 |
| **Shift + 滚轮** | 水平滚动平移视图 |
| **Alt + 滚轮** | 精细旋转角度 |
| **鼠标左键拖拽** | 自由平移图片 |
| <kbd>Esc</kbd> | 退出 PicoView，恢复浏览器原生渲染 |
| <kbd>T</kbd> | 切换透明棋盘格背景 (Checkerboard) |
| <kbd>P</kbd> | 切换像素化渲染模式 (禁用抗锯齿平滑) |
| <kbd>Q</kbd> | 逆时针旋转 90° |
| <kbd>E</kbd> | 顺时针旋转 90° |
| <kbd>H</kbd> | 水平镜像翻转 (Flip Horizontal) |
| <kbd>V</kbd> | 垂直镜像翻转 (Flip Vertical) |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | 上下左右平移视图（按住 <kbd>Shift</kbd> 加速平移） |

---

## 🚀 安装与使用

由于 PicoView 采用无编译步骤的原生架构，您可以直接在本地以开发者模式加载：

1. **下载或克隆代码仓库**：
   ```bash
   git clone https://github.com/your-username/PicoView.git
   ```
2. **打开浏览器扩展页面**：
   在基于 Chromium 的浏览器（Google Chrome、Microsoft Edge、Brave、Arc、Vivaldi 等）地址栏输入：
   ```text
   chrome://extensions
   ```
   *（Edge 浏览器为 `edge://extensions`）*
3. **开启开发者模式**：
   在扩展页面右上角打开 **“开发者模式” (Developer mode)** 开关。
4. **加载插件**：
   点击左上角的 **“加载已解压的扩展程序” (Load unpacked)** 按钮，选择 `PicoView` 所在的项目根目录。
5. **体验查看**：
   在任意网页中点击图片链接，或在网页图片上右键选择 **“在当前标签页打开图片”**，即可进入 PicoView！

---

## ⚙️ 个性化设置

点击浏览器工具栏上的 PicoView 图标，或右键图标选择“选项”，即可进入设置页面：

- **外观与视图**：
  - **背景样式**：纯色背景 / 当前图片模糊虚化。
  - **常规图片背景色**：自定义位图背后的背景色彩。
  - **SVG 矢量图背景色**：独立设置矢量图背景（如纯白或特定对比色）。
  - **初始缩放模式**：超出窗口时自适应（推荐） / 始终自适应窗口 / 原始尺寸 (100%)。
  - **初始对齐位置**：居中对齐、左上角、顶部居中等 9 种对齐锚点。
  - **平滑动画过渡**：切换缩放与旋转时启用丝滑过场动画。
- **操作与交互**：
  - **滚轮默认行为**：缩放图片（默认）或页面原生滚动。
  - **方向反转**：滚轮缩放、水平平移、垂直平移、旋转方向分别支持独立反转。
- **快捷键绑定**：
  - 点击按钮即可开始监听并录制新按键，右键点击对应项可清空快捷键。

---

## 📁 目录结构

```text
PicoView/
├── manifest.json                  # 扩展清单配置 (Manifest V3)
├── background.js                  # 后台 Service Worker (右键菜单、特殊协议转发)
├── content.js                     # 独立图片标签页注入与自启动接管
├── viewer-core.js                 # PicoView 核心视图引擎 (平移/缩放/手势/变换)
├── viewer-css.js                  # 查看器核心注入样式与动效
├── viewer-page.js                 # 独立 viewer.html 运行入口脚本
├── viewer.html                    # 独立查看器沙箱页面 (支持 base64/blob/SVG)
├── settings.js                    # 统一配置加载、校验与持久化存储模块
├── options.html                   # 设置页面结构
├── options.js                     # 设置页面交互与按键录制
├── options.css                    # 设置页面现代 UI 样式
├── icons/                         # 各种分辨率的扩展图标 (16~128px)
├── assets/                        # 项目设计资源与文档素材
│   ├── logo.png                   # PicoView 高清原始应用图标 (512x512)
│   └── banner.png                 # README 官方介绍与展示大图
└── README.md                      # 项目说明文档
```

---

## 📄 开源许可

本项目遵循 MIT License 开源协议。
