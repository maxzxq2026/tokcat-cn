import React from 'react'
import { humanizeTokens } from '../lib/format'

interface Segment {
  label: string
  value: number
  color: string
}

interface Props {
  segments: Segment[]
  centerLabel?: string
  centerValue?: string
  size?: number
}

export function DonutChart({ segments, centerLabel, centerValue, size = 160 }: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) return null

  const radius = size / 2 - 10
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = 28

  let currentAngle = -90 // 从顶部开始

  const paths = segments.map((segment, index) => {
    const percentage = segment.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`

    return (
      <path
        key={index}
        d={d}
        fill="none"
        stroke={segment.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        <title>{`${segment.label}: ${humanizeTokens(segment.value)} (${(percentage * 100).toFixed(1)}%)`}</title>
      </path>
    )
  })

  return (
    <div className="donut-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 背景圆环 */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* 数据段 */}
        {paths}
        {/* 中心文字 */}
        {centerLabel && (
          <text x={cx} y={cy - 8} textAnchor="middle" className="donut-center-label">
            {centerLabel}
          </text>
        )}
        {centerValue && (
          <text x={cx} y={cy + 12} textAnchor="middle" className="donut-center-value">
            {centerValue}
          </text>
        )}
      </svg>
      {/* 图例 */}
      <div className="donut-legend">
        {segments.map((segment, index) => {
          const percentage = total > 0 ? (segment.value / total * 100).toFixed(1) : '0'
          return (
            <div className="donut-legend-item" key={index}>
              <span className="donut-legend-dot" style={{ background: segment.color }} />
              <span className="donut-legend-label">{segment.label}</span>
              <span className="donut-legend-value">{percentage}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
