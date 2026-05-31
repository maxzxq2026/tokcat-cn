import React, { useMemo, useState } from 'react'
import { getClientStyle } from '../lib/clients'
import { addDays, formatCost, formatMonthDay, isoDate, parseISODate } from '../lib/format'
import type { Contribution, Stats, TokenBreakdown, UsagePayload } from '../lib/types'
import type { GridLayout } from '../lib/grid'
import { PieChart } from './PieChart'
import { TokenUsageCard } from './TokenUsageCard'
import { aggregateByModel } from '../lib/stats'

export type UsageView = '2d' | '3d'

interface Props {
  payload: UsagePayload
  clientIds: string[]
  title: string
  subtitle?: string
  view: UsageView
  onViewChange: (view: UsageView) => void
  grid: GridLayout
  graphLight: string
  graphDark: string
  accent: string
  contributions: Contribution[]
  month?: number
  year?: string
  /** When provided, the card leads with these token-usage totals (shown in both 2D and 3D). */
  stats?: Stats
}

interface Segment {
  clientId: string
  tokens: number
  cost: number
}

interface DayBar {
  date: string
  totalTokens: number
  totalCost: number
  segments: Segment[]
}

interface HoverState {
  bar: DayBar
  left: string
  top: string
  transform: string
}

const DAYS = 30

function tokenTotal(tokens: TokenBreakdown): number {
  return (
    (tokens.input || 0) +
    (tokens.output || 0) +
    (tokens.cacheRead || 0) +
    (tokens.cacheWrite || 0) +
    (tokens.reasoning || 0)
  )
}

function dayFromContribution(contribution: Contribution, allowed: Set<string>): DayBar {
  const grouped = new Map<string, Segment>()
  for (const client of contribution.clients) {
    if (!allowed.has(client.client)) continue
    const tokens = tokenTotal(client.tokens)
    if (tokens <= 0 && (client.cost || 0) <= 0) continue
    const slot = grouped.get(client.client) ?? {
      clientId: client.client,
      tokens: 0,
      cost: 0,
    }
    slot.tokens += tokens
    slot.cost += client.cost || 0
    grouped.set(client.client, slot)
  }
  const segments = Array.from(grouped.values()).sort((a, b) => a.clientId.localeCompare(b.clientId))
  return {
    date: contribution.date,
    totalTokens: segments.reduce((sum, s) => sum + s.tokens, 0),
    totalCost: segments.reduce((sum, s) => sum + s.cost, 0),
    segments,
  }
}

function exactTokens(tokens: number): string {
  return tokens.toLocaleString('en-US')
}

export function UsageBarGraph2D({
  payload,
  clientIds,
  title,
  subtitle,
  view,
  onViewChange,
  grid,
  graphLight,
  graphDark,
  accent,
  contributions,
  month,
  year,
  stats,
}: Props) {
  const [hover, setHover] = useState<HoverState | null>(null)
  const headSubtitle = subtitle

  // 计算饼图数据
  const pieSegments = useMemo(() => {
    // 颜色调色板（与 ModelBarChart 保持一致）
    const COLOR_PALETTE = [
      '#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
      '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#a855f7',
    ]

    // 特定模型的固定颜色
    const MODEL_FIXED_COLORS: Record<string, string> = {
      'deepseek': '#0066ff',
      'mimo': '#ff6b35',
      'qwen': '#7c3aed',
      'claude': '#8b5cf6',
      'sonnet': '#8b5cf6',
      'opus': '#7c3aed',
      'haiku': '#a78bfa',
      'gpt': '#10b981',
      'gpt-4o': '#059669',
      'gemini': '#3b82f6',
      'hermes': '#fbbf24',
      'llama': '#ef4444',
    }

    function getModelColor(model: string): string {
      const lower = model.toLowerCase()
      const sortedKeys = Object.keys(MODEL_FIXED_COLORS).sort((a, b) => b.length - a.length)
      for (const key of sortedKeys) {
        if (lower.includes(key)) return MODEL_FIXED_COLORS[key]
      }
      return ''
    }

    // 确定目标月份
    const targetMonth = month && month > 0 ? month : new Date().getMonth() + 1

    // 按月过滤贡献数据
    const filteredContributions = contributions.filter(c => {
      const date = new Date(c.date)
      return date.getMonth() + 1 === targetMonth
    })

    // 单个 Agent 页面：显示该 Agent 使用的模型占比
    if (clientIds.length === 1) {
      const modelMap = new Map<string, number>()
      for (const contribution of filteredContributions) {
        for (const client of contribution.clients) {
          if (!clientIds.includes(client.client)) continue
          const model = client.modelId || 'unknown'
          const tokens = (client.tokens.input || 0) + (client.tokens.output || 0) +
            (client.tokens.cacheRead || 0) + (client.tokens.cacheWrite || 0) +
            (client.tokens.reasoning || 0)
          modelMap.set(model, (modelMap.get(model) || 0) + tokens)
        }
      }
      // 按 Token 排序后分配颜色
      const sorted = Array.from(modelMap.entries()).sort((a, b) => b[1] - a[1])
      let paletteIndex = 0
      return sorted.map(([model, tokens]) => {
        const fixedColor = getModelColor(model)
        const color = fixedColor || COLOR_PALETTE[paletteIndex++ % COLOR_PALETTE.length]
        return { label: model, value: tokens, color }
      })
    }

    // 总览页面：显示各 Agent 占比
    const agentMap = new Map<string, number>()
    for (const contribution of filteredContributions) {
      for (const client of contribution.clients) {
        if (!clientIds.includes(client.client)) continue
        const tokens = (client.tokens.input || 0) + (client.tokens.output || 0) +
          (client.tokens.cacheRead || 0) + (client.tokens.cacheWrite || 0) +
          (client.tokens.reasoning || 0)
        agentMap.set(client.client, (agentMap.get(client.client) || 0) + tokens)
      }
    }
    return Array.from(agentMap.entries()).map(([clientId, tokens]) => ({
      label: getClientStyle(clientId).displayName,
      value: tokens,
      color: getClientStyle(clientId).color
    })).sort((a, b) => b.value - a.value)
  }, [contributions, clientIds, month])
  const bars = useMemo(() => {
    const allowed = new Set(clientIds)
    const byDate = new Map<string, DayBar>()
    for (const contribution of payload.contributions) {
      const day = dayFromContribution(contribution, allowed)
      if (day.totalTokens > 0 || day.totalCost > 0) byDate.set(day.date, day)
    }

    const fallbackEnd = isoDate(new Date())
    const end = payload.meta.dateRange.end || fallbackEnd
    const endDate = parseISODate(end)
    const startDate = addDays(endDate, -(DAYS - 1))
    const series: DayBar[] = []
    for (let i = 0; i < DAYS; i += 1) {
      const date = isoDate(addDays(startDate, i))
      series.push(byDate.get(date) ?? { date, totalTokens: 0, totalCost: 0, segments: [] })
    }
    return series
  }, [clientIds, payload])

  const maxTokens = Math.max(1, ...bars.map(b => b.totalTokens))
  const width = 520
  // viewBox height matches the rendered CSS height (.bar2d-svg) so there is no
  // vertical distortion, and equals the 3D canvas height so toggling 2D/3D
  // never changes the card height.
  const height = 240
  const top = 14
  const bottom = 24
  const chartHeight = height - top - bottom
  const gap = 4
  const barWidth = (width - gap * (bars.length - 1)) / bars.length
  const activeClients = clientIds.map(id => getClientStyle(id))

  function showTooltip(bar: DayBar, index: number) {
    if (bar.totalTokens <= 0 && bar.totalCost <= 0) return
    const x = index * (barWidth + gap)
    const totalHeight = (bar.totalTokens / maxTokens) * chartHeight
    const centerX = ((x + barWidth / 2) / width) * 100
    const topY = ((height - bottom - Math.max(totalHeight, 4) - 8) / height) * 100
    const transform =
      centerX > 74
        ? 'translate(-100%, calc(-100% - 8px))'
        : centerX < 26
          ? 'translate(0, calc(-100% - 8px))'
          : 'translate(-50%, calc(-100% - 8px))'
    setHover({
      bar,
      left: `${centerX}%`,
      top: `${Math.max(6, topY)}%`,
      transform,
    })
  }

  return (
    <div className="bar2d-card">
      <div className="bar2d-head">
        <div>
          <h2 className="bar2d-title">{title}</h2>
          {headSubtitle && <div className="bar2d-sub">{headSubtitle}</div>}
        </div>
        <div className="bar2d-head-right">
          <div className="bar2d-viewtoggle" role="group" aria-label="Chart view">
            <button
              type="button"
              className={`bar2d-viewbtn${view === '2d' ? ' is-active' : ''}`}
              onClick={() => onViewChange('2d')}
              aria-pressed={view === '2d'}
            >
              用量
            </button>
            <button
              type="button"
              className={`bar2d-viewbtn${view === '3d' ? ' is-active' : ''}`}
              onClick={() => onViewChange('3d')}
              aria-pressed={view === '3d'}
            >
              占比
            </button>
          </div>
          <div className="bar2d-legend">
            {activeClients.slice(0, 5).map(style => (
              <span key={style.id} className="bar2d-legend-item">
                <span className="bar2d-dot" style={{ background: style.color }} />
                {style.displayName.replace(/\s+(CLI|Code|IDE)$/i, '')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {stats && (
        <div className="bar2d-stats">
          <TokenUsageCard stats={stats} bare month={month} year={year} />
        </div>
      )}

      {view === '3d' ? (
        <div className="bar2d-pie">
          <PieChart segments={pieSegments} size={180} />
        </div>
      ) : (
      <div className="bar2d-chart" onMouseLeave={() => setHover(null)}>
        <svg className="bar2d-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <line x1="0" x2={width} y1={height - bottom} y2={height - bottom} className="bar2d-axis" />
          {bars.map((bar, index) => {
            const x = index * (barWidth + gap)
            const totalHeight = (bar.totalTokens / maxTokens) * chartHeight
            let y = height - bottom
            return (
              <g key={bar.date}>
                {bar.segments.map(segment => {
                  const h = bar.totalTokens > 0 ? (segment.tokens / bar.totalTokens) * totalHeight : 0
                  y -= h
                  const color = getClientStyle(segment.clientId).color
                  return (
                    <rect
                      key={segment.clientId}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(0, h)}
                      rx={2}
                      fill={color}
                      opacity={0.86}
                    >
                      <title>
                        {`${formatMonthDay(bar.date)} • ${getClientStyle(segment.clientId).displayName} • ${exactTokens(segment.tokens)} tokens`}
                      </title>
                    </rect>
                  )
                })}
                {bar.totalTokens === 0 && (
                  <rect x={x} y={height - bottom - 2} width={barWidth} height={2} rx={1} className="bar2d-empty" />
                )}
                {(bar.totalTokens > 0 || bar.totalCost > 0) && (
                  <rect
                    className="bar2d-hit"
                    x={x}
                    y={top}
                    width={barWidth}
                    height={chartHeight}
                    tabIndex={0}
                    role="img"
                    aria-label={`${formatMonthDay(bar.date)}, ${exactTokens(bar.totalTokens)} tokens`}
                    onMouseEnter={() => showTooltip(bar, index)}
                    onMouseMove={() => showTooltip(bar, index)}
                    onFocus={() => showTooltip(bar, index)}
                    onBlur={() => setHover(null)}
                  />
                )}
              </g>
            )
          })}
          <text x="0" y={height - 6} className="bar2d-label">{formatMonthDay(bars[0]?.date ?? '')}</text>
          <text x={width} y={height - 6} textAnchor="end" className="bar2d-label">
            {formatMonthDay(bars[bars.length - 1]?.date ?? '')}
          </text>
        </svg>
        {hover && (
          <div
            className="bar2d-tooltip"
            style={{ left: hover.left, top: hover.top, transform: hover.transform }}
            role="status"
          >
            <div className="bar2d-tooltip-date">{formatMonthDay(hover.bar.date)}</div>
            <div className="bar2d-tooltip-total">
              <span>{exactTokens(hover.bar.totalTokens)} tokens</span>
            </div>
            <div className="bar2d-tooltip-rows">
              {hover.bar.segments.map(segment => {
                const style = getClientStyle(segment.clientId)
                return (
                  <div className="bar2d-tooltip-row" key={segment.clientId}>
                    <span className="bar2d-tooltip-name">
                      <span className="bar2d-tooltip-dot" style={{ background: style.color }} />
                      {style.displayName.replace(/\s+(CLI|Code|IDE)$/i, '')}
                    </span>
                    <span className="bar2d-tooltip-value">
                      {exactTokens(segment.tokens)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
