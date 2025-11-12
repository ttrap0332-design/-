/**
 * QuaOcta Handshake (QOH) System
 * Ensures 8/8 channel acknowledgements within ±1 tick
 */

import type {
  QuaOctaHandshake,
  ChannelAcknowledgement,
  QuadOctaForce,
  BlueEngineCore,
} from '../types/index.js'

/**
 * Initialize a new QuaOcta Handshake
 */
export function initiateHandshake(bec: BlueEngineCore): QuaOctaHandshake {
  const forces: QuadOctaForce[] = [
    'Energy',
    'Matter',
    'Time',
    'Sound',
    'Motion',
    'Light',
    'Spirit',
    'Code',
  ]

  const channelAcks: ChannelAcknowledgement[] = forces.map((force, index) => ({
    channelId: index,
    force,
    acknowledged: false,
    tick: bec.omega48,
    latency: 0,
  }))

  return {
    id: `QOH-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    timestamp: Date.now(),
    channelAcks,
    complete: false,
    tickVariance: 0,
    status: 'pending',
  }
}

/**
 * Acknowledge a channel in the handshake
 */
export function acknowledgeChannel(
  handshake: QuaOctaHandshake,
  channelId: number,
  currentTick: number,
): QuaOctaHandshake {
  const acknowledgementTime = Date.now()
  const latency = acknowledgementTime - handshake.timestamp

  const updatedAcks = handshake.channelAcks.map((ack) =>
    ack.channelId === channelId
      ? {
          ...ack,
          acknowledged: true,
          tick: currentTick,
          latency,
        }
      : ack,
  )

  const allAcknowledged = updatedAcks.every((ack) => ack.acknowledged)
  const tickVariance = calculateTickVariance(updatedAcks)

  let status: QuaOctaHandshake['status'] = 'pending'
  if (allAcknowledged) {
    status = tickVariance <= 1 ? 'complete' : 'failed'
  }

  return {
    ...handshake,
    channelAcks: updatedAcks,
    complete: allAcknowledged && tickVariance <= 1,
    tickVariance,
    status,
  }
}

/**
 * Calculate tick variance across all acknowledged channels
 * Returns the maximum deviation from the mean tick
 */
function calculateTickVariance(acks: ChannelAcknowledgement[]): number {
  const acknowledgedAcks = acks.filter((ack) => ack.acknowledged)
  if (acknowledgedAcks.length === 0) return 0

  const ticks = acknowledgedAcks.map((ack) => ack.tick)
  const meanTick = ticks.reduce((sum, tick) => sum + tick, 0) / ticks.length

  // Calculate max deviation from mean, accounting for 48-tick wraparound
  const maxDeviation = Math.max(
    ...ticks.map((tick) => {
      const directDiff = Math.abs(tick - meanTick)
      const wrappedDiff = 48 - directDiff
      return Math.min(directDiff, wrappedDiff)
    }),
  )

  return maxDeviation
}

/**
 * Check if handshake is complete (8/8 channels acknowledged within ±1 tick)
 */
export function isHandshakeComplete(handshake: QuaOctaHandshake): boolean {
  return handshake.complete && handshake.status === 'complete'
}

/**
 * Check if handshake has failed
 */
export function hasHandshakeFailed(handshake: QuaOctaHandshake): boolean {
  return handshake.status === 'failed' || handshake.status === 'timeout'
}

/**
 * Mark handshake as timed out
 */
export function timeoutHandshake(handshake: QuaOctaHandshake): QuaOctaHandshake {
  return {
    ...handshake,
    status: 'timeout',
    complete: false,
  }
}

/**
 * Get handshake progress (percentage of channels acknowledged)
 */
export function getHandshakeProgress(handshake: QuaOctaHandshake): number {
  const acknowledgedCount = handshake.channelAcks.filter((ack) => ack.acknowledged).length
  return (acknowledgedCount / handshake.channelAcks.length) * 100
}

/**
 * Get average latency across all acknowledged channels
 */
export function getAverageLatency(handshake: QuaOctaHandshake): number {
  const acknowledgedAcks = handshake.channelAcks.filter((ack) => ack.acknowledged)
  if (acknowledgedAcks.length === 0) return 0

  const totalLatency = acknowledgedAcks.reduce((sum, ack) => sum + ack.latency, 0)
  return totalLatency / acknowledgedAcks.length
}

/**
 * Acknowledge all channels at once (for testing or perfect synchronization)
 */
export function acknowledgeAllChannels(
  handshake: QuaOctaHandshake,
  tick: number,
): QuaOctaHandshake {
  let updated = handshake
  for (let i = 0; i < 8; i++) {
    updated = acknowledgeChannel(updated, i, tick)
  }
  return updated
}
