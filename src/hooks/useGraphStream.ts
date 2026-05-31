import { useEffect, useRef, useState } from 'react'
import type { StreamEnvelope, UsagePayload } from '../lib/types'
import { isTauri } from '../lib/runtime'

interface State {
  payload: UsagePayload | null
  fetchedAt: string | null
  error: string | null
}

// 开发环境模拟数据
function getMockPayload(year: string): UsagePayload {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // 生成当月整月的模拟数据
  const contributions = []

  // 每个 Agent 的模型列表
  const clientModels: Record<string, string[]> = {
    'claude': ['claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku', 'claude-3.5-haiku'],
    'gemini': ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-2.0-pro'],
    'cursor': ['gpt-4o', 'claude-3.5-sonnet', 'gemini-2.0-flash'],
  }
  const clients = Object.keys(clientModels)

  // 获取当月第一天和最后一天
  const firstDay = new Date(currentYear, currentMonth - 1, 1)
  const lastDay = new Date(currentYear, currentMonth, 0)
  const daysInMonth = lastDay.getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth - 1, day)
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // 工作日用量多，周末少
    const baseTokens = isWeekend ? 5000 : 50000
    const randomFactor = 0.5 + Math.random()

    contributions.push({
      date: dateStr,
      totals: { tokens: baseTokens * randomFactor, cost: 0, messages: Math.floor(randomFactor * 10) },
      intensity: Math.min(4, Math.floor(randomFactor * 2)),
      tokenBreakdown: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 },
      clients: clients.flatMap(client => {
        const models = clientModels[client]
        // 每个 Agent 随机选择 1-2 个模型使用
        const numModels = Math.random() > 0.5 ? 2 : 1
        const selectedModels = models.slice(0, numModels)

        return selectedModels.map((modelId, idx) => ({
          client,
          modelId,
          providerId: 'openai',
          tokens: {
            input: Math.floor(baseTokens * randomFactor * (0.3 + idx * 0.1)),
            output: Math.floor(baseTokens * randomFactor * (0.2 + idx * 0.05)),
            cacheRead: Math.floor(baseTokens * randomFactor * 0.15),
            cacheWrite: Math.floor(baseTokens * randomFactor * 0.03),
            reasoning: Math.floor(baseTokens * randomFactor * 0.02)
          },
          cost: 0,
          messages: Math.floor(randomFactor * (3 - idx))
        }))
      })
    })
  }

  const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
  const monthEnd = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`

  return {
    meta: {
      generatedAt: now.toISOString(),
      version: 'tokcat-dev',
      dateRange: { start: monthStart, end: monthEnd }
    },
    summary: {
      totalTokens: 1200000,
      totalCost: 0,
      totalDays: daysInMonth,
      activeDays: Math.floor(daysInMonth * 0.7),
      averagePerDay: 40000,
      maxCostInSingleDay: 0,
      clients,
      models: Object.values(clientModels).flat()
    },
    years: [{ year, totalTokens: 1200000, totalCost: 0, range: { start: `${year}-01-01`, end: `${year}-12-31` } }],
    contributions
  }
}

export function useGraphStream(year: string): State {
  const [state, setState] = useState<State>({ payload: null, fetchedAt: null, error: null })
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!year) return
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    let disposed = false

    if (isTauri()) {
      let unlisten: (() => void) | null = null
      ;(async () => {
        try {
          const { invoke } = await import('@tauri-apps/api/core')
          const { listen } = await import('@tauri-apps/api/event')
          // Listen for periodic updates first to avoid missing the initial push.
          unlisten = await listen<StreamEnvelope>('graph-update', e => {
            const env = e.payload
            if (!env || env.year !== year) return
            if (disposed) return
            setState({ payload: env.payload, fetchedAt: env.fetchedAt, error: null })
          })
          const env = await invoke<StreamEnvelope>('get_graph', { year })
          if (disposed) return
          setState({ payload: env.payload, fetchedAt: env.fetchedAt, error: null })
        } catch (err) {
          if (disposed) return
          setState(s => ({ ...s, error: (err as Error).message ?? String(err) }))
        }
      })()
      cleanupRef.current = () => {
        disposed = true
        if (unlisten) unlisten()
      }
      return () => {
        if (cleanupRef.current) cleanupRef.current()
        cleanupRef.current = null
      }
    }

    // 浏览器环境：尝试 SSE，失败则使用模拟数据
    try {
      const es = new EventSource(`/api/stream?year=${encodeURIComponent(year)}`)
      es.addEventListener('data', ev => {
        try {
          const env: StreamEnvelope = JSON.parse((ev as MessageEvent).data)
          if (!disposed) {
            setState({ payload: env.payload, fetchedAt: env.fetchedAt, error: null })
          }
        } catch (e) {
          if (!disposed) {
            setState(s => ({ ...s, error: (e as Error).message }))
          }
        }
      })
      es.addEventListener('error', () => {
        es.close()
        // SSE 失败，使用模拟数据
        if (!disposed) {
          const mockPayload = getMockPayload(year)
          setState({ payload: mockPayload, fetchedAt: new Date().toISOString(), error: null })
        }
      })
      cleanupRef.current = () => {
        es.close()
      }
    } catch {
      // EventSource 创建失败，使用模拟数据
      const mockPayload = getMockPayload(year)
      setState({ payload: mockPayload, fetchedAt: new Date().toISOString(), error: null })
    }

    return () => {
      if (cleanupRef.current) cleanupRef.current()
      cleanupRef.current = null
    }
  }, [year])

  return state
}
