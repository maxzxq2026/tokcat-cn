import React from 'react'
import { humanizeTokens } from '../lib/format'

interface Segment {
  label: string
  value: number
  color: string
}

interface Props {
  segments: Segment[]
  size?: number
}

export function PieChart({ segments, size = 200 }: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) return null

  const radius = size / 2 - 10
  const cx = size / 2
  const cy = size / 2

  // 只有一个 segment 时，显示完整圆
  if (segments.length === 1) {
    const segment = segments[0]
    return (
      <div className="pie-chart">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill={segment.color}
            stroke="white"
            strokeWidth="2"
          >
            <title>{`${segment.label}: ${humanizeTokens(segment.value)} (100%)`}</title>
          </circle>
        </svg>
        <div className="pie-legend">
          <div className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: segment.color }} />
            <span className="pie-legend-label">{segment.label}</span>
            <span className="pie-legend-value">100%</span>
          </div>
        </div>
      </div>
    )
  }

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

    // 实心扇形路径
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    return (
      <path
        key={index}
        d={d}
        fill={segment.color}
        stroke="white"
        strokeWidth="2"
      >
        <title>{`${segment.label}: ${humanizeTokens(segment.value)} (${(percentage * 100).toFixed(1)}%)`}</title>
      </path>
    )
  })

  return (
    <div className="pie-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths}
      </svg>
      <div className="pie-legend">
        {segments.map((segment, index) => {
          const percentage = total > 0 ? (segment.value / total * 100).toFixed(1) : '0'
          return (
            <div className="pie-legend-item" key={index}>
              <span className="pie-legend-dot" style={{ background: segment.color }} />
              <span className="pie-legend-label">{segment.label}</span>
              <span className="pie-legend-value">{percentage}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
