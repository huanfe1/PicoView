<p align="center">
  <img src="./assets/banner.png" alt="PicoView Banner" width="480" style="border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</p>

<h1 align="center">PicoView</h1>

<p align="center">
  <strong>A sleek, ultra-fast, and modern image viewer extension for Chromium-based browsers</strong>
</p>

<p align="center">
  <a href="./README.md">简体中文</a> | <strong>English</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue.svg" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Version-1.0.0-green.svg" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/Dependencies-None-brightgreen.svg" alt="Dependencies None" />
  <img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License MIT" />
</p>

---

## 📖 Introduction

When opening standalone image tabs in Chromium browsers, the native viewer experience is often bare-bones: zoom increments are rigid, panning and rotating are unsupported, and transparent backgrounds or pixel-level details are difficult to inspect.

**PicoView** is a modern, lightweight, and dependency-free browser extension built on the Manifest V3 standard. It turns plain image tabs into a fluid, feature-rich viewing studio. Whether you are browsing photographs, inspecting transparent SVGs, or analyzing pixel art, PicoView delivers a seamless and delightful experience.

---

## ✨ Features

- 🚀 **Blazing Fast & Lightweight**: Crafted in pure vanilla JavaScript and CSS with zero external libraries or bundle bloat.
- 🔍 **Smooth Stepless Zoom**: Continuous zoom from 2% to 4000% anchored around your cursor.
- 🖐️ **Fluid Panning**: Drag images freely across the viewport with optional boundaries to prevent losing sight of the image.
- 🔄 **Rotation & Flip**: 90° clockwise/counter-clockwise rotation, plus instant horizontal (<kbd>H</kbd>) and vertical (<kbd>V</kbd>) flipping.
- 🏁 **Checkerboard Background**: One-key toggle for a high-contrast transparency grid behind transparent PNGs, WebP, and SVGs.
- 👾 **Pixelated Mode**: Crisp nearest-neighbor rendering without blur or bilinear interpolation—ideal for pixel art, sprites, and icons.
- 🎨 **Immersive Backdrops**:
  - Solid background colors with independent palettes for standard bitmaps and transparent vector SVGs.
  - Dynamic blurred backdrop generated from the current image.
- 🌐 **Built-in Internationalization (i18n)**:
  - Full English and Simplified Chinese support with automatic system language detection and manual language override.
- ⚡ **Thoughtful Interactions**:
  - Dedicated SVG background color ensures dark vector paths remain clearly visible.
  - Context menu integration: "Open image in current tab".
  - Accessible design with live screen reader announcements and keyboard navigation.
- 🛠️ **Customizable Controls**: Interactive shortcut recorder to rebind or disable any key, plus independent inversion toggles for wheel zoom, pan, and rotation.

---

## ⌨️ Controls & Default Shortcuts

All keyboard shortcuts can be rebound or cleared in the Settings page:

| Shortcut / Action | Function |
| :--- | :--- |
| **Mouse Wheel** | Smooth zoom centered on cursor (default mode) |
| **Ctrl + Wheel** | Vertical pan |
| **Shift + Wheel** | Horizontal pan |
| **Alt + Wheel** | Precise rotation |
| **Left Click + Drag** | Pan image freely |
| <kbd>Esc</kbd> | Exit PicoView and restore native browser rendering |
| <kbd>T</kbd> | Toggle transparent checkerboard background |
| <kbd>P</kbd> | Toggle pixelated rendering (disable smoothing) |
| <kbd>Q</kbd> | Rotate 90° counter-clockwise |
| <kbd>E</kbd> | Rotate 90° clockwise |
| <kbd>H</kbd> | Flip horizontally |
| <kbd>V</kbd> | Flip vertically |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Pan viewport (hold <kbd>Shift</kbd> for faster panning) |

---

## 🚀 Installation & Usage

1. **Download the archive**: Open [Releases](https://github.com/huanfe1/PicoView/releases) and download the latest `PicoView-v*.zip`.
2. **Unzip**: Unzipping it gives you a `PicoView` folder. Keep the folder intact instead of pulling out individual files.
3. **Open the extensions page**: In Chrome, go to:
   ```text
   chrome://extensions
   ```
   Edge uses `edge://extensions`. Brave, Arc, Vivaldi, and other Chromium browsers use their own extensions page.
4. **Turn on Developer mode**: Enable **Developer mode** in the top-right corner.
5. **Load the extension**: Click **Load unpacked** and select the unzipped `PicoView` folder.
6. **Start viewing**: Open a standalone image URL, or right-click an image on a webpage and choose **"Open image in current tab"**.

---

## ⚙️ Options & Customization

Click the PicoView icon in the browser toolbar or right-click it and choose "Options" to open the settings:

- **Appearance & View**:
  - **Interface Language**: Follow System (Auto) / English / 简体中文.
  - **Background Style**: Solid color or blurred backdrop from the image.
  - **Bitmap Background Color**: Custom background color behind JPG, PNG, and WebP images.
  - **SVG Background Color**: Independent color dedicated to vector SVGs.
  - **Initial Zoom**: Fit if larger (Recommended) / Always fit window / Actual size (100%).
  - **Initial Alignment**: 9 alignment anchor presets (Center, Top-Left, etc.).
  - **Smooth Transitions**: Enable or disable fluid CSS transitions.
- **Controls & Gestures**:
  - **Wheel Default Mode**: Zoom image (Recommended) or native page scroll.
  - **Inversion Options**: Individually invert directions for zoom, vertical pan, horizontal pan, and rotation.
  - **Context Menu Item**: Toggle right-click menu entry.
- **Keyboard Shortcuts**:
  - Click any key button to record a new key binding.
  - Right-click an assigned key to clear its shortcut.

---

## 📁 Directory Structure

```text
PicoView/
├── src/                           # Extension source; release archives are packed from here
│   ├── _locales/                  # Chrome Extension i18n locales
│   │   ├── en/messages.json       # English messages
│   │   └── zh_CN/messages.json    # Simplified Chinese messages
│   ├── manifest.json              # Manifest V3 extension configuration
│   ├── background.js              # Background service worker (context menu & routing)
│   ├── content.js                 # Content script for standalone image tabs
│   ├── i18n.js                    # Lightweight unified i18n manager & dictionaries
│   ├── viewer-core.js             # PicoView view engine (pan/zoom/gestures/transforms)
│   ├── viewer-css.js              # Core injected styles and animations
│   ├── viewer-page.js             # Standalone viewer sandbox runner
│   ├── viewer.html                # Isolated viewer sandbox page
│   ├── settings.js                # Centralized settings loading & schema normalization
│   ├── options.html               # Options page layout
│   ├── options.js                 # Options page logic & key recording
│   ├── options.css                # Options page modern UI styling
│   └── icons/                     # Extension icons (16px to 128px)
├── assets/                        # Design assets and documentation media (not shipped)
│   ├── logo.png                   # PicoView high-resolution app icon (512x512)
│   └── banner.png                 # README official display banner
├── README.md                      # Documentation (简体中文)
└── README_EN.md                   # Documentation (English)
```

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
