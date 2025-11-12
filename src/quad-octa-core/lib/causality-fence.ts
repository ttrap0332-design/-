/**
 * Causality Fence Implementation
 * Spirit governs other force activations - no misaligned intent allowed
 */

import type {
  CausalityFence,
  ForceState,
  QuadOctaForce,
  BlueEngineCore,
} from '../types/index.js'

/**
 * Initialize causality fence
 */
export function initializeCausalityFence(spiritState: ForceState): CausalityFence {
  const governedForces: QuadOctaForce[] = [
    'Energy',
    'Matter',
    'Time',
    'Sound',
    'Motion',
    'Light',
    'Code',
  ]

  return {
    spiritState,
    governedForces,
    activationAllowed: false,
    intentAlignment: 0,
    misalignmentDetected: false,
  }
}

/**
 * Update spirit state in causality fence
 */
export function updateSpiritState(
  fence: CausalityFence,
  spiritState: ForceState,
): CausalityFence {
  const intentAlignment = calculateIntentAlignment(spiritState)

  return {
    ...fence,
    spiritState,
    intentAlignment,
    activationAllowed: intentAlignment >= 0.7,
    misalignmentDetected: intentAlignment < 0.5,
  }
}

/**
 * Calculate intent alignment from spirit state
 * Based on amplitude and synchronization
 */
function calculateIntentAlignment(spiritState: ForceState): number {
  // Amplitude contribution (0-1)
  const amplitudeScore = spiritState.amplitude / 100

  // Synchronization contribution (0 or 1)
  const syncScore = spiritState.synchronized ? 1 : 0

  // Phase alignment contribution (closer to 0 or 48 is better)
  const phaseAlignment = Math.min(spiritState.phase, 48 - spiritState.phase) / 24
  const phaseScore = 1 - phaseAlignment

  // Weighted combination
  return amplitudeScore * 0.4 + syncScore * 0.4 + phaseScore * 0.2
}

/**
 * Check if force activation is allowed
 */
export function isActivationAllowed(
  fence: CausalityFence,
  force: QuadOctaForce,
): boolean {
  if (force === 'Spirit') {
    // Spirit can always activate itself
    return true
  }

  return fence.activationAllowed && fence.governedForces.includes(force)
}

/**
 * Attempt to activate a force (returns true if allowed)
 */
export function attemptForceActivation(
  fence: CausalityFence,
  force: QuadOctaForce,
): { allowed: boolean; fence: CausalityFence } {
  const allowed = isActivationAllowed(fence, force)

  if (!allowed && force !== 'Spirit') {
    // Record misalignment detection
    return {
      allowed: false,
      fence: {
        ...fence,
        misalignmentDetected: true,
      },
    }
  }

  return {
    allowed: true,
    fence,
  }
}

/**
 * Create causality fences from Blue Engine Core
 */
export function createCausalityFences(bec: BlueEngineCore): CausalityFence[] {
  const spiritForce = bec.forceStates.find((fs) => fs.force === 'Spirit')

  if (!spiritForce) {
    return []
  }

  // Create one fence per governed force
  const governedForces: QuadOctaForce[] = [
    'Energy',
    'Matter',
    'Time',
    'Sound',
    'Motion',
    'Light',
    'Code',
  ]

  return governedForces.map((force) => {
    const fence = initializeCausalityFence(spiritForce)
    return updateSpiritState(fence, spiritForce)
  })
}

/**
 * Validate all causality fences
 */
export function validateCausalityFences(
  fences: CausalityFence[],
): { valid: boolean; misalignments: number } {
  const misalignments = fences.filter((f) => f.misalignmentDetected).length
  const valid = misalignments === 0 && fences.every((f) => f.intentAlignment >= 0.5)

  return { valid, misalignments }
}

/**
 * Get overall intent alignment across all fences
 */
export function getOverallIntentAlignment(fences: CausalityFence[]): number {
  if (fences.length === 0) return 0

  const totalAlignment = fences.reduce((sum, fence) => sum + fence.intentAlignment, 0)
  return totalAlignment / fences.length
}

/**
 * Check if Spirit is properly governing all forces
 */
export function isSpiritGoverning(fences: CausalityFence[]): boolean {
  return fences.every((fence) => fence.activationAllowed) && fences.length > 0
}

/**
 * Realign causality fences (requires Spirit force to be strong)
 */
export function realignCausalityFences(
  fences: CausalityFence[],
  spiritState: ForceState,
): CausalityFence[] {
  return fences.map((fence) => updateSpiritState(fence, spiritState))
}
