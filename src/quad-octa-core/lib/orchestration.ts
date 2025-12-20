/**
 * Quad-Octa Orchestration System
 * Daily, weekly, and annual synchronization scheduling
 */

import type {
  OrchestrationSchedule,
  DailyOrchestration,
  WeeklyOrchestration,
  AnnualOrchestration,
  QuarterOrchestration,
} from '../types/index.js'

/**
 * Initialize orchestration schedule
 */
export function initializeOrchestrationSchedule(): OrchestrationSchedule {
  return {
    daily: generateDailySlots(),
    weekly: generateWeeklyOrchestration(1),
    annual: generateAnnualOrchestration(2025),
  }
}

/**
 * Generate 48 daily orchestration slots
 */
function generateDailySlots(): DailyOrchestration[] {
  return Array.from({ length: 48 }, (_, slot) => ({
    slot,
    tick: slot, // Maps directly to Ω48 tick
    metaSync: false,
    physicalSync: false,
    spiritualSync: false,
    timestamp: 0,
  }))
}

/**
 * Generate weekly orchestration with 48 slots
 */
function generateWeeklyOrchestration(week: number): WeeklyOrchestration {
  return {
    week,
    slots: generateDailySlots(),
    metaPhysicalAlignment: 0,
  }
}

/**
 * Generate annual orchestration
 */
function generateAnnualOrchestration(year: number): AnnualOrchestration {
  return {
    year,
    quarters: Array.from({ length: 4 }, (_, i) =>
      generateQuarterOrchestration(i + 1),
    ),
    totalSync: 0,
  }
}

/**
 * Generate quarterly orchestration
 */
function generateQuarterOrchestration(quarter: number): QuarterOrchestration {
  return {
    quarter,
    weeks: Array.from({ length: 13 }, (_, i) =>
      generateWeeklyOrchestration(quarter * 13 - 12 + i),
    ),
    alignment: 0,
  }
}

/**
 * Synchronize a daily slot
 */
export function synchronizeDailySlot(
  schedule: OrchestrationSchedule,
  slotIndex: number,
  metaSync: boolean,
  physicalSync: boolean,
  spiritualSync: boolean,
): OrchestrationSchedule {
  const updatedDaily = schedule.daily.map((slot, index) =>
    index === slotIndex
      ? {
          ...slot,
          metaSync,
          physicalSync,
          spiritualSync,
          timestamp: Date.now(),
        }
      : slot,
  )

  return {
    ...schedule,
    daily: updatedDaily,
  }
}

/**
 * Calculate daily sync percentage
 */
export function calculateDailySyncPercentage(daily: DailyOrchestration[]): number {
  const syncedSlots = daily.filter(
    (slot) => slot.metaSync && slot.physicalSync && slot.spiritualSync,
  ).length

  return (syncedSlots / daily.length) * 100
}

/**
 * Calculate weekly meta-physical alignment
 */
export function calculateWeeklyAlignment(weekly: WeeklyOrchestration): number {
  const metaSynced = weekly.slots.filter((slot) => slot.metaSync).length
  const physicalSynced = weekly.slots.filter((slot) => slot.physicalSync).length

  const metaScore = metaSynced / weekly.slots.length
  const physicalScore = physicalSynced / weekly.slots.length

  // Alignment is how close meta and physical sync are to each other
  return 1 - Math.abs(metaScore - physicalScore)
}

/**
 * Update weekly orchestration
 */
export function updateWeeklyOrchestration(
  schedule: OrchestrationSchedule,
  weekNumber: number,
): OrchestrationSchedule {
  const alignment = calculateWeeklyAlignment(schedule.weekly)

  return {
    ...schedule,
    weekly: {
      ...schedule.weekly,
      week: weekNumber,
      metaPhysicalAlignment: alignment,
    },
  }
}

/**
 * Calculate quarterly alignment
 */
export function calculateQuarterAlignment(quarter: QuarterOrchestration): number {
  const totalAlignment = quarter.weeks.reduce(
    (sum, week) => sum + week.metaPhysicalAlignment,
    0,
  )

  return totalAlignment / quarter.weeks.length
}

/**
 * Calculate annual total sync
 */
export function calculateAnnualSync(annual: AnnualOrchestration): number {
  const quarterAlignments = annual.quarters.map((q) => calculateQuarterAlignment(q))
  const avgAlignment = quarterAlignments.reduce((sum, a) => sum + a, 0) / 4

  return avgAlignment * 100 // Return as percentage
}

/**
 * Update annual orchestration
 */
export function updateAnnualOrchestration(
  schedule: OrchestrationSchedule,
): OrchestrationSchedule {
  const totalSync = calculateAnnualSync(schedule.annual)

  const updatedQuarters = schedule.annual.quarters.map((quarter) => ({
    ...quarter,
    alignment: calculateQuarterAlignment(quarter),
  }))

  return {
    ...schedule,
    annual: {
      ...schedule.annual,
      quarters: updatedQuarters,
      totalSync,
    },
  }
}

/**
 * Get current slot based on time of day
 * Divides 24 hours into 48 slots (30 minutes each)
 */
export function getCurrentSlot(): number {
  const now = new Date()
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes()
  const slotDuration = (24 * 60) / 48 // 30 minutes per slot
  return Math.floor(minutesSinceMidnight / slotDuration)
}

/**
 * Get orchestration status summary
 */
export function getOrchestrationSummary(schedule: OrchestrationSchedule): {
  dailySyncPercentage: number
  weeklyAlignment: number
  annualSync: number
  currentSlot: number
} {
  return {
    dailySyncPercentage: calculateDailySyncPercentage(schedule.daily),
    weeklyAlignment: schedule.weekly.metaPhysicalAlignment * 100,
    annualSync: schedule.annual.totalSync,
    currentSlot: getCurrentSlot(),
  }
}

/**
 * Reset daily orchestration (for new day)
 */
export function resetDailyOrchestration(
  schedule: OrchestrationSchedule,
): OrchestrationSchedule {
  return {
    ...schedule,
    daily: generateDailySlots(),
  }
}

/**
 * Advance to next week
 */
export function advanceToNextWeek(
  schedule: OrchestrationSchedule,
): OrchestrationSchedule {
  const nextWeekNumber = schedule.weekly.week + 1

  return {
    ...schedule,
    weekly: generateWeeklyOrchestration(nextWeekNumber),
    daily: generateDailySlots(),
  }
}
