import React, { useMemo } from 'react'
import type { Contribution } from '../lib/types'
import type { TraceBucket } from '../lib/usage'
import { aggregateByModel } from '../lib/stats'
import { getClientStyle } from '../lib/clients'
import { humanizeTokens } from '../lib/format'
import { ModelBarChart } from './ModelBarChart'

interface Props {
  clients: string[]
  contributions: Contribution[]
  trace: TraceBucket[]
  title?: string
  showCache?: boolean
  month?: number
}

/** Normalize trace client IDs to match contribution client IDs. */
function normalizeTraceClient(raw: string): string {
  if (raw === 'claude-code') return 'claude'
  return raw
}

/** Find the most-used model for a given agent from trace data. */
function currentModel(trace: TraceBucket[], clientId: string): string | null {
  const match = trace
    .filter(t => normalizeTraceClient(t.client) === clientId && t.model)
    .sort((a, b) => b.tokens - a.tokens)
  return match[0]?.model ?? null
}

export function AgentModelCard({ clients, contributions, trace, title, showCache = false, month }: Props) {
  const isSingle = clients.length === 1

  // Per-agent aggregation: top model + total tokens/messages
  const agentRows = useMemo(() => {
    return clients.map(clientId => {
      const models = aggregateByModel(contributions, [clientId], month)
      const totalTokens = models.reduce((s, m) => s + m.tokens, 0)
      const totalMessages = models.reduce((s, m) => s + m.messages, 0)
      const liveModel = currentModel(trace, clientId)
      const topModel = liveModel || models[0]?.model || null
      const style = getClientStyle(clientId)
      return { clientId, style, topModel, totalTokens, totalMessages, models }
    })
  }, [clients, contributions, trace, month])

  // 获取月份显示
  const currentMonth = month || new Date().getMonth() + 1
  const monthLabel = month === 0 ? '全年' : `${currentMonth}`

  // Single-agent detail view
  if (isSingle) {
    const row = agentRows[0]
    if (!row) return null
    return (
      <div className="agent-model-card">
        <div className="agent-model-head">
          <h2 className="agent-model-title">{title ?? `${row.style.displayName} 模型用量`}</h2>
          <span className="agent-model-note">{monthLabel}</span>
        </div>
        <div className="agent-model-summary">
          <div className="agent-model-stat">
            <span className="agent-model-stat-label">模型</span>
            <span className="agent-model-stat-value">{row.topModel || '—'}</span>
          </div>
          <div className="agent-model-stat">
            <span className="agent-model-stat-label">Token</span>
            <span className="agent-model-stat-value">{humanizeTokens(row.totalTokens)}</span>
          </div>
          <div className="agent-model-stat">
            <span className="agent-model-stat-label">调用</span>
            <span className="agent-model-stat-value">{row.totalMessages > 0 ? `${row.totalMessages.toLocaleString()} 次` : '—'}</span>
          </div>
        </div>
        {row.models.length > 0 && (
          <ModelBarChart models={row.models} showCache={showCache} />
        )}
      </div>
    )
  }

  // Overview: multi-agent compact list
  return (
    <div className="agent-model-card">
      <div className="agent-model-head">
        <h2 className="agent-model-title">{title ?? 'Agent 模型用量'}</h2>
        <span className="agent-model-note">近30天</span>
      </div>
      <div className="agent-model-list">
        {agentRows.map(row => (
          <div className="agent-model-row" key={row.clientId}>
            <span className="agent-model-dot" style={{ background: row.style.color }} />
            <span className="agent-model-name">{row.style.displayName}</span>
            <span className="agent-model-mid">{row.topModel || '—'}</span>
            <span className="agent-model-tokens">{humanizeTokens(row.totalTokens)}</span>
            <span className="agent-model-msgs">
              {row.totalMessages > 0 ? `${row.totalMessages.toLocaleString()}次` : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
