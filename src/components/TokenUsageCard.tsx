import React from 'react'
import type { Stats } from '../lib/types'
import { humanizeTokens } from '../lib/format'

interface Props {
  stats: Stats
  bare?: boolean
  month?: number
  year?: string
}

export function TokenUsageCard({ stats, bare = false, month, year }: Props) {
  // 获取今天的日期
  const today = new Date()
  const todayStr = `${today.getMonth() + 1}/${today.getDate()}`

  // 获取月份显示
  const currentMonth = month || today.getMonth() + 1
  const currentYear = year || String(today.getFullYear())
  const monthStr = month === 0 ? `${currentYear}` : `${currentYear}/${currentMonth}`

  // 获取峰值日期
  const peakDate = stats.bestDay ? formatMonthDay(stats.bestDay.date) : '—'

  const grid = (
    <div className={`usage-row-card${bare ? ' is-bare' : ''}`}>
      <div className="usage-cell">
        <div className="usage-num">{humanizeTokens(stats.todayTokens)}</div>
        <div className="usage-label">今天</div>
      </div>
      <div className="usage-cell">
        <div className="usage-num">{humanizeTokens(stats.monthTokens)}</div>
        <div className="usage-label">{monthStr}</div>
      </div>
      <div className="usage-cell">
        <div className="usage-num">{humanizeTokens(stats.peakDayTokens)}</div>
        <div className="usage-label">{peakDate}</div>
      </div>
    </div>
  )
  if (bare) return grid
  return (
    <div className="usage-card">
      <h2 className="usage-heading">Token 用量</h2>
      {grid}
    </div>
  )
}

// 格式化月日
function formatMonthDay(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
