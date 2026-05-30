import React from 'react'

interface Props {
  longest: number
  current: number
}

export function StreaksCard({ longest, current }: Props) {
  return (
    <div className="streaks-card">
      <h2 className="streaks-heading">连续使用</h2>
      <div className="streaks-row">
        <div className="streak-item">
          <div className="streak-num">{longest}<span className="streak-unit">天</span></div>
          <div className="streak-label">最长</div>
        </div>
        <div className="streak-item">
          <div className="streak-num">{current}<span className="streak-unit">天</span></div>
          <div className="streak-label">当前</div>
        </div>
      </div>
    </div>
  )
}
