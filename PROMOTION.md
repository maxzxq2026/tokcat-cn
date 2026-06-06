# Tokcat 中文版 — 推广文案合集

---

## 一、掘金 / CSDN 技术文章

### 标题
**我用 Rust + Tauri 做了一个 AI Token 监控面板，再也不怕 API 账单刺客了**

### 正文

你上个月在 AI 编程工具上花了多少钱？

如果你用 Claude Code 写代码、用 Cursor 补全、偶尔还调一下 DeepSeek 和通义千问——你大概率不知道。因为这些工具的账单分散在各个平台，没人帮你汇总。

我做了 **Tokcat 中文版**，一个 macOS 菜单栏常驻的 AI Token 用量监控工具：

**它能做什么：**
- 📊 一眼看清所有 AI 工具的 Token 消耗（支持 10+ 工具）
- 🐱 菜单栏常驻，不占 Dock，不打扰
- 📈 模型用量分析：柱状图 + 饼图，看哪个模型最烧钱
- 📅 按月查看历史数据，掌握消费趋势
- 🔒 100% 本地运行，零网络请求，零隐私风险
- 🇨🇳 完整中文界面，新增 DeepSeek、通义千问、Mimo 等国产 AI 工具支持

**技术栈：**
- 前端：React + TypeScript + Vite
- 后端：Rust（Tauri 2）
- 图表：SVG + Canvas

**为什么用 Tauri？**
因为要读取各个 AI 工具的本地日志文件，Electron 太重，Tauri 的 Rust 后端可以直接操作文件系统，内存占用只有 Electron 的 1/10。

**安装：**
```sh
brew install --cask handlecusion/tokcat/tokcat
```

或者从 GitHub Releases 下载 DMG 手动安装。

**项目地址：** https://github.com/maxzxq2026/tokcat-cn

欢迎 star 和提 issue！

---

## 二、V2EX 分享创造帖

### 标题
**[分享] Tokcat 中文版 — macOS 菜单栏 AI Token 用量监控，支持 Claude Code/Cursor/DeepSeek 等 10+ 工具**

### 正文

各位好，分享一个我做的小工具。

**Tokcat 中文版** — macOS 菜单栏 AI Token 用量监控。

用了很多 AI 编程工具（Claude Code、Cursor、DeepSeek、通义千问……），但每次看账单都是一脸懵——钱花哪了？哪个模型最烧钱？

做了这个工具，菜单栏常驻，一眼看清所有 AI 工具的 Token 消耗。

**特点：**
- 支持 10+ AI 工具（Claude Code、Cursor、DeepSeek、通义千问、Mimo 等）
- 模型用量分析（柱状图 + 饼图）
- 100% 本地运行，零隐私风险
- 完整中文界面
- 菜单栏常驻，不占 Dock

**技术栈：** Rust + Tauri 2 + React

**安装：**
```sh
brew install --cask handlecusion/tokcat/tokcat
```

**项目地址：** https://github.com/maxzxq2026/tokcat-cn

欢迎试用，有问题随时提 issue。

---

## 三、知乎回答（适用于「有哪些好用的 AI 工具推荐？」类问题）

### 正文

推荐一个我自己在用的 macOS 小工具：**Tokcat 中文版**。

如果你同时用多个 AI 编程工具（Claude Code、Cursor、DeepSeek、通义千问等），你一定遇到过这个问题：**钱花哪了？**

每个工具的账单分散在不同平台，没人帮你汇总。Tokcat 就是解决这个问题的——它常驻在 macOS 菜单栏，一眼看清所有 AI 工具的 Token 消耗。

**核心功能：**
- 支持 10+ AI 工具的本地日志读取
- 模型用量分析（柱状图 + 饼图，看哪个模型最烧钱）
- 按月查看历史数据
- 100% 本地运行，零隐私风险
- 完整中文界面

**安装：**
```sh
brew install --cask handlecusion/tokcat/tokcat
```

项目地址：https://github.com/maxzxq2026/tokcat-cn

---

## 四、即刻动态

### 文本

🐱 做了一个 macOS 菜单栏小工具：Tokcat 中文版

同时用 Claude Code + Cursor + DeepSeek + 通义千问的我，终于能一眼看清 Token 消耗了。

特点：
• 10+ AI 工具支持
• 模型用量分析（柱状图 + 饼图）
• 100% 本地运行
• 完整中文界面

Rust + Tauri 2 开发，内存占用极低。

#独立开发者 #开源 #AI工具 #macOS

项目地址：github.com/maxzxq2026/tokcat-cn

---

## 五、小红书 / B站 标题

### 小红书
**标题：** 做了一个菜单栏 AI 账单监控🐱再也不怕 API 刺客了
**标签：** #AI工具 #macOS #程序员 #开源 #ClaudeCode #Cursor

### B站视频
**标题：** 【开源】我用 Rust 做了一个 AI Token 监控面板，菜单栏常驻，一眼看清所有 AI 工具的消耗
**简介：** Tokcat 中文版，macOS 菜单栏 AI Token 用量监控工具，支持 Claude Code/Cursor/DeepSeek/通义千问等 10+ 工具。Rust + Tauri 2 开发。

---

## 六、Reddit (r/rust)

### Title
**Show HN: Tokcat — macOS menu-bar AI token usage monitor (Rust + Tauri 2)**

### Body
I built Tokcat, a macOS menu-bar app that tracks AI coding tool token usage across Claude Code, Cursor, DeepSeek, Qwen, and 10+ other clients.

Built with Tauri 2 (Rust backend + React frontend). Reads local session logs, no telemetry, no cloud sync.

Features:
- 2D/3D GitHub-style contribution graph
- Per-client filters
- Live tokens/min in menu bar
- Animated tray icon that reflects token velocity

Repo: https://github.com/maxzxq2026/tokcat-cn

This is a Chinese-localized fork with additional support for DeepSeek, Qwen, and Mimo.

---

## 发布节奏建议

1. **今天**：先发 V2EX（最直接的程序员社区）
2. **明天**：发掘金技术文章（需要写得更详细）
3. **后天**：发知乎回答（找相关问题）
4. **周末**：录 B站 demo 视频
5. **持续**：每天在相关社区回复问题时顺便提一下

**重点：V2EX 和掘金效果最好，优先发这两个。**
