<h1 align="center">Tokcat</h1>

<p align="center">
  <strong>macOS 菜单栏 AI Token 用量监控工具</strong>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh-CN.md">中文</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/macOS-11%2B-black?style=flat-square&logo=apple" alt="macOS 11+">
  <img src="https://img.shields.io/badge/Apple%20Silicon-arm64-success?style=flat-square" alt="Apple Silicon">
  <img src="https://img.shields.io/badge/built%20with-Tauri%202-FFC131?style=flat-square&logo=tauri&logoColor=black" alt="Tauri 2">
</p>

---

## 简介

**Tokcat** 是一款专为 macOS 设计的 **AI Token 用量监控工具**，运行在菜单栏，轻量、简洁、无干扰。

支持 **Claude Code、Cursor、Gemini、DeepSeek、Qwen、Mimo** 等 10+ AI 编程工具的本地日志读取，一站式查看你的 Token 消耗。

---

## 核心功能

| 功能 | 说明 |
|------|------|
| **Token 用量统计** | 今日 / 本月 / 峰值，一目了然 |
| **多 Agent 支持** | Claude Code、Cursor、Gemini、DeepSeek、Qwen、Mimo 等 |
| **模型用量分析** | 每个 Agent 的模型使用占比，柱状图 + 饼图 |
| **缓存命中率** | 查看 API 缓存效率，优化使用策略 |
| **月份选择** | 按月查看历史数据 |
| **实时会话** | 10 分钟内 Token 消耗速率 |
| **连续使用统计** | 最长连续天数、当前连续天数 |
| **深色/浅色主题** | 跟随系统或手动切换 |

---

## 界面预览

### 总览页面
- Token 用量条形图（按 Agent 堆叠）
- Agent 模型用量列表
- 实时会话追踪
- 连续使用统计

### Agent 详情页面
- 模型用量柱状图（颜色区分）
- 模型占比饼图
- 缓存命中率分析

---

## 安装

### 方式一：Homebrew（推荐）

```sh
brew install --cask handlecusion/tokcat/tokcat
```

### 方式二：手动安装

1. 从 [Releases](https://github.com/maxzxq2026/tokcat-cn/releases) 下载 `Tokcat_x.x.x_aarch64.dmg`
2. 双击安装，拖入 Applications
3. 首次运行需执行：
```sh
xattr -dr com.apple.quarantine /Applications/Tokcat.app
codesign --force --deep --sign - /Applications/Tokcat.app
```

---

## 使用

1. 启动 **Tokcat**，菜单栏出现图标
2. 点击图标打开面板
3. 右键菜单：设置、刷新、检查更新、退出

---

## 技术栈

- **前端**：React + TypeScript + Vite
- **后端**：Rust (Tauri 2)
- **图表**：SVG + Canvas

---

## 特点

- **本地优先**：所有数据读取自本地日志，无网络请求
- **轻量运行**：菜单栏常驻，不占 Dock
- **多模型支持**：自动识别不同模型，颜色区分
- **中文界面**：完整中文翻译

---

## 适配的 AI 工具

| 工具 | 状态 |
|------|------|
| Claude Code | ✅ |
| Cursor | ✅ |
| Gemini CLI | ✅ |
| DeepSeek | ✅ |
| Qwen CLI | ✅ |
| Mimo | ✅ |
| Copilot CLI | ✅ |
| OpenCode | ✅ |
| Codex CLI | ✅ |
| Hermes | ✅ |

---

## 许可证

MIT

---

<p align="center">
  <sub>macOS 11+ · Apple Silicon · Tauri 2 · React · MIT</sub>
</p>
