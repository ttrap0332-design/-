/**
 * Blue Engine Core (BEC) - Master Clock and Harmonics Engine
 * Operates at Ω48 (48 ticks per phase)
 * Synchronizes all 8 forces: Energy, Matter, Time, Sound, Motion, Light, Spirit, Code
 */

import type {
  BlueEngineCore,
  ForceState,
  QuadOctaForce,
} from '../types/index.js'

/**
 * Initialize Blue Engine Core with Ω48 clock
 */
export function initializeBlueEngineCore(): BlueEngineCore {
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

  const forceStates: ForceState[] = forces.map((force, index) => ({
    force,
    amplitude: 50 + index * 5, // Staggered initial amplitudes
    phase: index * 6, // Distribute evenly across 48 ticks (48/8 = 6)
    synchronized: false,
    lastSync: 0,
  }))

  return {
    omega48: 0,
    phase: 0,
    forceStates,
    clockRate: 48, // 48 ticks per phase
    harmonicsLocked: false,
    timestamp: Date.now(),
  }
}

/**
 * Advance the Ω48 clock by one tick
 */
export function advanceClock(bec: BlueEngineCore): BlueEngineCore {
  const nextTick = (bec.omega48 + 1) % 48
  const nextPhase = nextTick === 0 ? bec.phase + 1 : bec.phase

  return {
    ...bec,
    omega48: nextTick,
    phase: nextPhase,
    timestamp: Date.now(),
  }
}

/**
 * Synchronize a specific force to the master clock
 */
export function synchronizeForce(
  bec: BlueEngineCore,
  force: QuadOctaForce,
  targetPhase: number,
): BlueEngineCore {
  const updatedForceStates = bec.forceStates.map((fs) =>
    fs.force === force
      ? {
          ...fs,
          phase: targetPhase % 48,
          synchronized: Math.abs((targetPhase % 48) - bec.omega48) <= 1,
          lastSync: Date.now(),
        }
      : fs,
  )

  return {
    ...bec,
    forceStates: updatedForceStates,
  }
}

/**
 * Synchronize all 8 forces to the current Ω48 tick
 */
export function synchronizeAllForces(bec: BlueEngineCore): BlueEngineCore {
  const currentTick = bec.omega48
  const updatedForceStates: ForceState[] = bec.forceStates.map((fs, index) => ({
    ...fs,
    phase: (currentTick + index * 6) % 48, // Maintain harmonic spacing
    synchronized: true,
    lastSync: Date.now(),
  }))

  return {
    ...bec,
    forceStates: updatedForceStates,
    harmonicsLocked: true,
    timestamp: Date.now(),
  }
}

/**
 * Check if all forces are synchronized within ±1 tick
 */
export function checkHarmonicsLock(bec: BlueEngineCore): boolean {
  const currentTick = bec.omega48
  return bec.forceStates.every((fs) => {
    const phaseDiff = Math.abs(fs.phase - currentTick)
    // Account for wraparound (e.g., tick 47 and tick 0 are adjacent)
    const wrappedDiff = Math.min(phaseDiff, 48 - phaseDiff)
    return wrappedDiff <= 1 || fs.synchronized
  })
}

/**
 * Update force amplitude
 */
export function updateForceAmplitude(
  bec: BlueEngineCore,
  force: QuadOctaForce,
  amplitude: number,
): BlueEngineCore {
  const clampedAmplitude = Math.max(0, Math.min(100, amplitude))
  const updatedForceStates = bec.forceStates.map((fs) =>
    fs.force === force ? { ...fs, amplitude: clampedAmplitude } : fs,
  )

  return {
    ...bec,
    forceStates: updatedForceStates,
  }
}

/**
 * Get force state by name
 */
export function getForceState(
  bec: BlueEngineCore,
  force: QuadOctaForce,
): ForceState | undefined {
  return bec.forceStates.find((fs) => fs.force === force)
}

/**
 * Calculate harmonic resonance across all forces
 * Returns value 0-1 indicating overall system harmony
 */
export function calculateHarmonicResonance(bec: BlueEngineCore): number {
  if (bec.forceStates.length === 0) return 0

  // Calculate phase coherence
  const avgPhase =
    bec.forceStates.reduce((sum, fs) => sum + fs.phase, 0) / bec.forceStates.length

  const phaseVariance =
    bec.forceStates.reduce((sum, fs) => sum + Math.pow(fs.phase - avgPhase, 2), 0) /
    bec.forceStates.length

  // Lower variance = higher resonance
  const phaseResonance = Math.max(0, 1 - phaseVariance / 576) // 576 = 24^2 (max variance for 48 ticks)

  // Calculate amplitude balance
  const avgAmplitude =
    bec.forceStates.reduce((sum, fs) => sum + fs.amplitude, 0) / bec.forceStates.length

  const amplitudeVariance =
    bec.forceStates.reduce((sum, fs) => sum + Math.pow(fs.amplitude - avgAmplitude, 2), 0) /
    bec.forceStates.length

  const amplitudeBalance = Math.max(0, 1 - amplitudeVariance / 2500) // 2500 = 50^2

  // Synchronization factor
  const syncCount = bec.forceStates.filter((fs) => fs.synchronized).length
  const syncFactor = syncCount / bec.forceStates.length

  // Overall harmonic resonance (weighted combination)
  return phaseResonance * 0.4 + amplitudeBalance * 0.3 + syncFactor * 0.3
}

/**
 * Reset harmonics lock (useful for recalibration)
 */
export function resetHarmonicsLock(bec: BlueEngineCore): BlueEngineCore {
  const updatedForceStates = bec.forceStates.map((fs) => ({
    ...fs,
    synchronized: false,
  }))

  return {
    ...bec,
    forceStates: updatedForceStates,
    harmonicsLocked: false,
  }
}
