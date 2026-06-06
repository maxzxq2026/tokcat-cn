<h1 align="center">
  <img src="docs/screenshots/tray-anim-cat2.gif" alt="Tokcat" width="48" />
  <br>
  Tokcat 中文版
</h1>

<p align="center">
  <strong>macOS 菜单栏 AI Token 用量监控工具</strong>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh-CN.md">中文</a> |
  <a href="README.ko-KR.md">한국어</a>
</p>

<p align="center">
  <a href="https://github.com/maxzxq2026/tokcat-cn/releases/latest"><img src="https://img.shields.io/github/v/release/maxzxq2026/tokcat-cn?style=flat-square&color=blue" alt="Release"></a>
  <a href="https://github.com/maxzxq2026/tokcat-cn/stargazers"><img src="https://img.shields.io/github/stars/maxzxq2026/tokcat-cn?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/maxzxq2026/tokcat-cn/network/members"><img src="https://img.shields.io/github/forks/maxzxq2026/tokcat-cn?style=flat-square" alt="Forks"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT Licence"></a>
  <img src="https://img.shields.io/badge/macOS-11%2B-black?style=flat-square&logo=apple" alt="macOS 11+">
  <img src="https://img.shields.io/badge/Apple%20Silicon-arm64-success?style=flat-square" alt="Apple Silicon">
  <img src="https://img.shields.io/badge/built%20with-Tauri%202-FFC131?style=flat-square&logo=tauri&logoColor=black" alt="Tauri 2">
</p>

<br>

> 你上个月在 AI 编程工具上花了多少钱？你不知道——因为你根本看不见。
>
> **Tokcat** 让你在菜单栏一眼看清所有 AI 工具的 Token 消耗。

<br>

<p align="center">
  <img src="docs/screenshots/dashboard-3d.png" alt="Tokcat 3D 贡献图" width="700" />
</p>

<p align="center">
  <img src="docs/screenshots/dashboard-2d.png" alt="Tokcat 2D 热力图" width="700" />
</p>

---

## ✨ 为什么选择 Tokcat 中文版

| 特性 | 说明 |
|------|------|
| 🇨🇳 **完整中文界面** | 全中文 UI，对中文用户友好 |
| 🤖 **国内 AI 工具支持** | 新增 DeepSeek、通义千问、Mimo 等国产 AI 工具适配 |
| 📊 **模型用量分析** | 每个 Agent 的模型使用占比，柱状图 + 饼图可视化 |
| 📈 **缓存命中率** | 查看 API 缓存效率，帮你优化使用策略、节省费用 |
| 📅 **月份选择** | 按月查看历史数据，清晰掌握消费趋势 |
| 🔒 **100% 本地运行** | 所有数据读取自本地日志，零网络请求，零隐私风险 |
| 🐱 **菜单栏常驻** | 不占 Dock，不打扰，一眼看清 Token 消耗 |

---

## 🛠 支持的 AI 工具

| 工具 | 状态 | 说明 |
|------|:----:|------|
| Claude Code | ✅ | 本地日志自动读取 |
| Cursor | ✅ | 编辑器内 AI 用量 |
| Gemini CLI | ✅ | Google AI 工具 |
| DeepSeek | ✅ | 国产大模型 |
| 通义千问 (Qwen) | ✅ | 阿里 AI 工具 |
| Mimo | ✅ | 国产 AI 助手 |
| GitHub Copilot | ✅ | 代码补全 |
| OpenCode | ✅ | 开源 AI 工具 |
| Codex CLI | ✅ | OpenAI 工具 |
| Hermes | ✅ | AI 编程助手 |

---

## 📦 安装

### 方式一：Homebrew（推荐）

```sh
brew install --cask handlecusion/tokcat/tokcat
```

### 方式二：手动安装

1. 从 [Releases](https://github.com/maxzxq2026/tokcat-cn/releases) 下载最新版 `Tokcat_x.x.x_aarch64.dmg`
2. 双击安装，拖入 Applications 文件夹
3. 首次运行需执行（因为未上架 App Store）：

```sh
xattr -dr com.apple.quarantine /Applications/Tokcat.app
codesign --force --deep --sign - /Applications/Tokcat.app
```

---

## 🚀 使用方法

1. 启动 **Tokcat**，菜单栏出现 🐱 图标
2. 点击图标打开用量面板
3. 右键菜单可：设置、刷新、检查更新、退出

### 快捷操作

| 操作 | 快捷键 |
|------|--------|
| 打开设置 | <kbd>⌘</kbd> + <kbd>,</kbd> |
| 立即刷新 | <kbd>⌘</kbd> + <kbd>R</kbd> |
| 退出 Tokcat | <kbd>⌘</kbd> + <kbd>Q</kbd> |

---

## 📊 功能详解

### 总览页面
- **Token 用量条形图**：按 Agent 堆叠展示，一眼看清各工具消耗
- **Agent 模型用量列表**：每个 Agent 使用了哪些模型
- **实时会话追踪**：10 分钟内 Token 消耗速率
- **连续使用统计**：最长连续天数、当前连续天数

### Agent 详情页面
- **模型用量柱状图**：不同模型颜色区分
- **模型占比饼图**：直观展示各模型使用比例
- **缓存命中率分析**：优化 API 使用策略

---

## 🏗 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + TypeScript + Vite |
| 后端 | Rust (Tauri 2) |
| 图表 | SVG + Canvas |
| 分发 | Homebrew Cask + DMG |

---

## 🔧 从源码构建

```sh
git clone https://github.com/maxzxq2026/tokcat-cn.git
cd tokcat-cn
pnpm install
pnpm tauri:dev          # 开发模式，带 HMR 热更新
pnpm tauri:build        # 生产构建，生成 .app + .dmg
```

---

## 📝 与原版的区别

本项目基于 [handlecusion/tokcat](https://github.com/handlecusion/tokcat) 的优秀工作，进行了以下改进：

- ✅ 完整中文界面翻译
- ✅ 新增 DeepSeek、通义千问、Mimo 等国产 AI 工具支持
- ✅ 新增模型用量分析（柱状图 + 饼图）
- ✅ 新增缓存命中率统计
- ✅ 新增月份选择器
- ✅ 更新端点指向中文版仓库，避免被原版更新覆盖

---

## 📄 许可证

MIT License

---

<p align="center">
  <sub>macOS 11+ · Apple Silicon · Tauri 2 · React · MIT</sub>
</p>
