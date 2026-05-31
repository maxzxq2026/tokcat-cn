import type { Contribution, PerDay, Stats, TokenBreakdown, UsagePayload } from './types'
import { computeStreaks } from './streaks'

export interface ModelAggregate {
  model: string
  tokens: number
  messages: number
  breakdown: TokenBreakdown
}

export interface DayStats {
  todayTokens: number
  monthTokens: number
  peakDayTokens: number
}

/**
 * Aggregate contributions by modelId.
 * Optionally filter to specific client IDs and month.
 */
export function aggregateByModel(
  contributions: Contribution[],
  clientFilter?: string[],
  month?: number,
): ModelAggregate[] {
  const allowed = clientFilter ? new Set(clientFilter) : null
  const map = new Map<string, ModelAggregate>()

  // 确定目标月份
  const targetMonth = month && month > 0 ? month : new Date().getMonth() + 1

  for (const c of contributions) {
    // 按月过滤
    const date = new Date(c.date)
    if (date.getMonth() + 1 !== targetMonth) continue

    for (const cc of c.clients) {
      if (allowed && !allowed.has(cc.client)) continue
      const model = cc.modelId || 'unknown'
      let entry = map.get(model)
      if (!entry) {
        entry = { model, tokens: 0, messages: 0, breakdown: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 } }
        map.set(model, entry)
      }
      const t = cc.tokens
      entry.tokens += (t.input || 0) + (t.output || 0) + (t.cacheRead || 0) + (t.cacheWrite || 0) + (t.reasoning || 0)
      entry.messages += cc.messages || 0
      entry.breakdown.input += t.input || 0
      entry.breakdown.output += t.output || 0
      entry.breakdown.cacheRead += t.cacheRead || 0
      entry.breakdown.cacheWrite += t.cacheWrite || 0
      entry.breakdown.reasoning += t.reasoning || 0
    }
  }

  return Array.from(map.values()).sort((a, b) => b.tokens - a.tokens)
}

export function computeStats(payload: UsagePayload, selectedClients: Set<string>, month?: number): Stats {
  const perDay: PerDay[] = []
  const perDayMap = new Map<string, PerDay>()
  const present = new Set<string>()

  let totalTokens = 0
  let totalCost = 0
  let bestDay: { date: string; cost: number } | null = null
  let maxTokens = 0

  // 当日日期
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const currentMonth = month && month > 0 ? month : today.getMonth() + 1

  // 单独计算选择月份的数据（用于 monthTokens）
  let monthTokens = 0

  for (const c of payload.contributions) {
    // 按月过滤
    if (month && month > 0) {
      const date = new Date(c.date)
      if (date.getMonth() + 1 !== month) continue
    }

    let dayTokens = 0
    let dayCost = 0
    for (const cc of c.clients) {
      present.add(cc.client)
      if (!selectedClients.has(cc.client)) continue
      const t = cc.tokens
      dayTokens += (t.input || 0) + (t.output || 0) + (t.cacheRead || 0) + (t.cacheWrite || 0) + (t.reasoning || 0)
      dayCost += cc.cost || 0
    }
    if (dayTokens === 0 && dayCost === 0) continue
    const entry: PerDay = { date: c.date, tokens: dayTokens, cost: dayCost, intensity: c.intensity }
    perDay.push(entry)
    perDayMap.set(c.date, entry)
    totalTokens += dayTokens
    totalCost += dayCost
    if (dayTokens > maxTokens) maxTokens = dayTokens
    if (!bestDay || dayCost > bestDay.cost) bestDay = { date: c.date, cost: dayCost }

    // 计算选择月份的数据
    const date = new Date(c.date)
    if (date.getMonth() + 1 === currentMonth) {
      let dayMonthTokens = 0
      for (const cc of c.clients) {
        if (!selectedClients.has(cc.client)) continue
        const t = cc.tokens
        dayMonthTokens += (t.input || 0) + (t.output || 0) + (t.cacheRead || 0) + (t.cacheWrite || 0) + (t.reasoning || 0)
      }
      monthTokens += dayMonthTokens
    }
  }

  const activeDays = perDay.length
  const averagePerDay = activeDays > 0 ? totalCost / activeDays : 0
  const dateRange = payload.meta.dateRange
  const streaks = computeStreaks(perDayMap, dateRange.start, dateRange.end)

  // 计算当日用量
  const todayEntry = perDayMap.get(todayStr)
  const todayTokens = todayEntry?.tokens ?? 0

  // 计算峰值（单日最高）
  const peakDayTokens = maxTokens

  return {
    totalTokens,
    totalCost,
    activeDays,
    bestDay,
    averagePerDay,
    dateRange,
    perDay,
    perDayMap,
    streaks,
    presentClients: Array.from(present).sort(),
    years: payload.years,
    maxTokens,
    todayTokens,
    monthTokens, // 根据选择的月份显示
    peakDayTokens,
  }
}
