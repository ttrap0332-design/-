/**
 * Guarantee Envelope Implementation
 * Green, Amber, Red Assurance Modes with R² ring-redundancy
 */

import type { GuaranteeEnvelope, AssuranceMode } from '../types/index.js'

/**
 * Initialize Guarantee Envelope with default settings
 */
export function initializeGuaranteeEnvelope(primaryPath: string): GuaranteeEnvelope {
  return {
    mode: 'Green',
    primaryPath,
    redundantPaths: [],
    ringRedundancy: false,
    failoverActive: false,
    guarantee: 1.0, // Full guarantee in Green mode
  }
}

/**
 * Set assurance mode
 */
export function setAssuranceMode(
  envelope: GuaranteeEnvelope,
  mode: AssuranceMode,
): GuaranteeEnvelope {
  let guarantee: number = 0
  switch (mode) {
    case 'Green':
      guarantee = 1.0
      break
    case 'Amber':
      guarantee = 0.7
      break
    case 'Red':
      guarantee = 0.3
      break
  }

  return {
    ...envelope,
    mode,
    guarantee,
  }
}

/**
 * Add redundant path
 */
export function addRedundantPath(
  envelope: GuaranteeEnvelope,
  path: string,
): GuaranteeEnvelope {
  if (envelope.redundantPaths.includes(path)) {
    return envelope
  }

  const redundantPaths = [...envelope.redundantPaths, path]
  const ringRedundancy = redundantPaths.length >= 2 // R² requires at least 2 redundant paths

  // Upgrade guarantee level if ring redundancy is achieved
  let guarantee = envelope.guarantee
  if (ringRedundancy) {
    guarantee = Math.min(1.0, guarantee + 0.2) // Boost guarantee by 20%
  }

  return {
    ...envelope,
    redundantPaths,
    ringRedundancy,
    guarantee,
  }
}

/**
 * Remove redundant path
 */
export function removeRedundantPath(
  envelope: GuaranteeEnvelope,
  path: string,
): GuaranteeEnvelope {
  const redundantPaths = envelope.redundantPaths.filter((p) => p !== path)
  const ringRedundancy = redundantPaths.length >= 2

  // Downgrade guarantee if ring redundancy is lost
  let guarantee = envelope.guarantee
  if (!ringRedundancy && envelope.ringRedundancy) {
    guarantee = Math.max(0, guarantee - 0.2)
  }

  return {
    ...envelope,
    redundantPaths,
    ringRedundancy,
    guarantee,
    failoverActive: false, // Deactivate failover if path is removed
  }
}

/**
 * Activate failover (switch to redundant path)
 */
export function activateFailover(envelope: GuaranteeEnvelope): GuaranteeEnvelope {
  if (envelope.redundantPaths.length === 0) {
    // Cannot activate failover without redundant paths
    return {
      ...envelope,
      mode: 'Red',
      guarantee: 0,
      failoverActive: false,
    }
  }

  // Promote first redundant path to primary
  const [newPrimary, ...remainingPaths] = envelope.redundantPaths

  return {
    ...envelope,
    primaryPath: newPrimary,
    redundantPaths: [envelope.primaryPath, ...remainingPaths],
    failoverActive: true,
  }
}

/**
 * Deactivate failover (restore original configuration)
 */
export function deactivateFailover(
  envelope: GuaranteeEnvelope,
  originalPrimary: string,
): GuaranteeEnvelope {
  if (!envelope.failoverActive) {
    return envelope
  }

  // Remove current primary from redundant paths and restore original
  const redundantPaths = envelope.redundantPaths.filter((p) => p !== originalPrimary)
  redundantPaths.push(envelope.primaryPath)

  return {
    ...envelope,
    primaryPath: originalPrimary,
    redundantPaths,
    failoverActive: false,
  }
}

/**
 * Check if envelope has R² ring-redundancy
 */
export function hasRingRedundancy(envelope: GuaranteeEnvelope): boolean {
  return envelope.ringRedundancy
}

/**
 * Get effective guarantee level
 * Considers mode, redundancy, and failover status
 */
export function getEffectiveGuarantee(envelope: GuaranteeEnvelope): number {
  let effective = envelope.guarantee

  // Penalty if failover is active (indicates primary failure)
  if (envelope.failoverActive) {
    effective *= 0.9
  }

  // Bonus for ring redundancy
  if (envelope.ringRedundancy) {
    effective = Math.min(1.0, effective * 1.1)
  }

  return Math.max(0, Math.min(1.0, effective))
}

/**
 * Auto-recover from failure by activating failover
 */
export function autoRecover(envelope: GuaranteeEnvelope): GuaranteeEnvelope {
  if (envelope.redundantPaths.length === 0) {
    // Cannot auto-recover without redundancy
    return setAssuranceMode(envelope, 'Red')
  }

  return activateFailover(envelope)
}
