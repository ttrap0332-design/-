/**
 * QuaOcta Bus (QOB-8×6) Implementation
 * 8 channels × 6 strata = 48 lanes architecture
 * Each channel corresponds to one of the 8 forces
 */

import type {
  QuaOctaBus,
  BusChannel,
  BusLane,
  QuadOctaForce,
} from '../types/index.js'

/**
 * Initialize QuaOcta Bus with 8 channels and 6 strata (48 total lanes)
 */
export function initializeQuaOctaBus(): QuaOctaBus {
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

  const channels: BusChannel[] = forces.map((force, channelId) => ({
    id: channelId,
    force,
    lanes: Array.from({ length: 6 }, (_, stratum) => ({
      id: stratum,
      channelId,
      data: null,
      status: 'operational',
    })),
    active: true,
    throughput: 0,
  }))

  return {
    channels,
    strata: 6,
    totalLanes: 48,
    bandwidth: 1000, // MB/s
    status: 'active',
  }
}

/**
 * Get a specific bus channel by force
 */
export function getChannel(qob: QuaOctaBus, force: QuadOctaForce): BusChannel | undefined {
  return qob.channels.find((ch) => ch.force === force)
}

/**
 * Get a specific bus lane
 */
export function getLane(
  qob: QuaOctaBus,
  channelId: number,
  laneId: number,
): BusLane | undefined {
  const channel = qob.channels.find((ch) => ch.id === channelId)
  return channel?.lanes.find((lane) => lane.id === laneId)
}

/**
 * Write data to a specific lane
 */
export function writeLane(
  qob: QuaOctaBus,
  channelId: number,
  laneId: number,
  data: unknown,
): QuaOctaBus {
  const updatedChannels = qob.channels.map((channel) => {
    if (channel.id !== channelId) return channel

    const updatedLanes = channel.lanes.map((lane) =>
      lane.id === laneId ? { ...lane, data, status: 'operational' as const } : lane,
    )

    return {
      ...channel,
      lanes: updatedLanes,
      throughput: channel.throughput + 1,
    }
  })

  return {
    ...qob,
    channels: updatedChannels,
  }
}

/**
 * Read data from a specific lane
 */
export function readLane(qob: QuaOctaBus, channelId: number, laneId: number): unknown {
  const lane = getLane(qob, channelId, laneId)
  return lane?.data
}

/**
 * Mark a lane as degraded
 */
export function degradeLane(
  qob: QuaOctaBus,
  channelId: number,
  laneId: number,
): QuaOctaBus {
  const updatedChannels = qob.channels.map((channel) => {
    if (channel.id !== channelId) return channel

    const updatedLanes = channel.lanes.map((lane) =>
      lane.id === laneId ? { ...lane, status: 'degraded' as const } : lane,
    )

    return { ...channel, lanes: updatedLanes }
  })

  return updateBusStatus({
    ...qob,
    channels: updatedChannels,
  })
}

/**
 * Mark a lane as offline
 */
export function offlineLane(
  qob: QuaOctaBus,
  channelId: number,
  laneId: number,
): QuaOctaBus {
  const updatedChannels = qob.channels.map((channel) => {
    if (channel.id !== channelId) return channel

    const updatedLanes = channel.lanes.map((lane) =>
      lane.id === laneId ? { ...lane, status: 'offline' as const } : lane,
    )

    return { ...channel, lanes: updatedLanes }
  })

  return updateBusStatus({
    ...qob,
    channels: updatedChannels,
  })
}

/**
 * Restore a lane to operational status
 */
export function restoreLane(
  qob: QuaOctaBus,
  channelId: number,
  laneId: number,
): QuaOctaBus {
  const updatedChannels = qob.channels.map((channel) => {
    if (channel.id !== channelId) return channel

    const updatedLanes = channel.lanes.map((lane) =>
      lane.id === laneId ? { ...lane, status: 'operational' as const } : lane,
    )

    return { ...channel, lanes: updatedLanes }
  })

  return updateBusStatus({
    ...qob,
    channels: updatedChannels,
  })
}

/**
 * Update overall bus status based on lane health
 */
function updateBusStatus(qob: QuaOctaBus): QuaOctaBus {
  const allLanes = qob.channels.flatMap((ch) => ch.lanes)
  const operationalCount = allLanes.filter((lane) => lane.status === 'operational').length
  const offlineCount = allLanes.filter((lane) => lane.status === 'offline').length
  const degradedCount = allLanes.filter((lane) => lane.status === 'degraded').length

  let status: 'active' | 'degraded' | 'failed'

  if (offlineCount > 24) {
    // More than half offline
    status = 'failed'
  } else if (offlineCount > 0 || degradedCount > 12) {
    status = 'degraded'
  } else {
    status = 'active'
  }

  return {
    ...qob,
    status,
  }
}

/**
 * Get bus health metrics
 */
export function getBusHealth(qob: QuaOctaBus): {
  operational: number
  degraded: number
  offline: number
  healthPercentage: number
} {
  const allLanes = qob.channels.flatMap((ch) => ch.lanes)
  const operational = allLanes.filter((lane) => lane.status === 'operational').length
  const degraded = allLanes.filter((lane) => lane.status === 'degraded').length
  const offline = allLanes.filter((lane) => lane.status === 'offline').length

  return {
    operational,
    degraded,
    offline,
    healthPercentage: (operational / allLanes.length) * 100,
  }
}

/**
 * Broadcast data to all lanes of a specific channel
 */
export function broadcastToChannel(
  qob: QuaOctaBus,
  channelId: number,
  data: unknown,
): QuaOctaBus {
  const updatedChannels = qob.channels.map((channel) => {
    if (channel.id !== channelId) return channel

    const updatedLanes = channel.lanes.map((lane) => ({
      ...lane,
      data,
    }))

    return {
      ...channel,
      lanes: updatedLanes,
      throughput: channel.throughput + updatedLanes.length,
    }
  })

  return {
    ...qob,
    channels: updatedChannels,
  }
}

/**
 * Clear all data from the bus
 */
export function clearBus(qob: QuaOctaBus): QuaOctaBus {
  const clearedChannels = qob.channels.map((channel) => ({
    ...channel,
    lanes: channel.lanes.map((lane) => ({
      ...lane,
      data: null,
    })),
    throughput: 0,
  }))

  return {
    ...qob,
    channels: clearedChannels,
  }
}

/**
 * Get total throughput across all channels
 */
export function getTotalThroughput(qob: QuaOctaBus): number {
  return qob.channels.reduce((sum, channel) => sum + channel.throughput, 0)
}
