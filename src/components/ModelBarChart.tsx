import React, { useMemo } from 'react'
import type { ModelAggregate } from '../lib/stats'
import { humanizeTokens } from '../lib/format'

interface Props {
  models: ModelAggregate[]
  showCache?: boolean
}

// 预定义的颜色调色板（区分度高）
const COLOR_PALETTE = [
  '#8b5cf6', // 紫
  '#10b981', // 绿
  '#3b82f6', // 蓝
  '#f59e0b', // 黄
  '#ef4444', // 红
  '#ec4899', // 粉
  '#06b6d4', // 青
  '#f97316', // 橙
  '#84cc16', // 青绿
  '#a855f7', // 亮紫
]

// 特定模型的固定颜色（品牌色）
const MODEL_FIXED_COLORS: Record<string, string> = {
  'deepseek': '#0066ff',
  'deepseek-v2': '#0066ff',
  'deepseek-v3': '#0066ff',
  'mimo': '#ff6b35',
  'mimo-7b': '#ff6b35',
  'qwen': '#7c3aed',
  'qwen-2': '#7c3aed',
  'qwen-2.5': '#8b5cf6',
  'claude': '#8b5cf6',
  'claude-3': '#8b5cf6',
  'claude-3.5': '#a78bfa',
  'claude-4': '#7c3aed',
  'sonnet': '#8b5cf6',
  'opus': '#7c3aed',
  'haiku': '#a78bfa',
  'gpt': '#10b981',
  'gpt-4': '#10b981',
  'gpt-4o': '#059669',
  'o3': '#059669',
  'o4': '#047857',
  'gemini': '#3b82f6',
  'gemini-2': '#60a5fa',
  'hermes': '#fbbf24',
  'llama': '#ef4444',
}

// 为模型列表生成颜色映射（每个 Agent 独立）
function generateModelColors(models: string[]): Map<string, string> {
  const colorMap = new Map<string, string>()
  let paletteIndex = 0

  models.forEach(model => {
    const lower = model.toLowerCase()
    let color: string | null = null

    // 先尝试匹配固定颜色（优先匹配更长的关键词）
    const sortedKeys = Object.keys(MODEL_FIXED_COLORS).sort((a, b) => b.length - a.length)
    for (const key of sortedKeys) {
      if (lower.includes(key)) {
        color = MODEL_FIXED_COLORS[key]
        break
      }
    }

    // 没有固定颜色则使用调色板
    if (!color) {
      color = COLOR_PALETTE[paletteIndex % COLOR_PALETTE.length]
      paletteIndex++
    }

    colorMap.set(model, color)
  })

  return colorMap
}

export function ModelBarChart({ models, showCache = false }: Props) {
  if (models.length === 0) return null
  const maxTokens = Math.max(1, ...models.map(m => m.tokens))

  // 为当前模型列表生成颜色映射
  const colorMap = useMemo(() => generateModelColors(models.map(m => m.model)), [models])

  // 计算整体缓存率
  const totalTokens = models.reduce((sum, m) => sum + m.tokens, 0)
  const totalCacheRead = models.reduce((sum, m) => sum + m.breakdown.cacheRead, 0)
  const overallCacheRate = totalTokens > 0 ? (totalCacheRead / totalTokens * 100).toFixed(0) : '0'

  return (
    <div className="model-bars">
      {models.map(m => {
        const pct = (m.tokens / maxTokens) * 100
        const color = colorMap.get(m.model) || '#6b7280'
        const label = m.model === 'unknown' ? '未知模型' : m.model

        // 缓存占比
        const cacheRate = m.tokens > 0 ? (m.breakdown.cacheRead / m.tokens) : 0
        const normalRate = 1 - cacheRate

        return (
          <div className="model-bar-row" key={m.model}>
            <div className="model-bar-label" title={label}>
              {label}
            </div>
            <div className="model-bar-track">
              {showCache ? (
                // 堆叠条：缓存（浅色） + 正常（深色）= 总宽度 pct%
                <>
                  <div
                    className="model-bar-cache"
                    style={{
                      width: `${Math.round(pct * cacheRate)}%`,
                      background: `${color}40`,
                      borderRight: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                  <div
                    className="model-bar-normal"
                    style={{ width: `${Math.round(pct * normalRate)}%`, background: color }}
                  />
                </>
              ) : (
                // 简单条
                <div
                  className="model-bar-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              )}
            </div>
            <div className="model-bar-val">
              {showCache ? (
                <span className="model-cache-inline">
                  {humanizeTokens(m.tokens)} {(cacheRate * 100).toFixed(0)}% {m.messages > 0 ? `${m.messages}次` : ''}
                </span>
              ) : (
                humanizeTokens(m.tokens)
              )}
            </div>
          </div>
        )
      })}
      {showCache && (
        <div className="model-cache-summary">
          <span>整体缓存率: {overallCacheRate}%</span>
          <span>节省: {humanizeTokens(totalCacheRead)}</span>
        </div>
      )}
    </div>
  )
}
