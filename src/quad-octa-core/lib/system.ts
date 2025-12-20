/**
 * Quad-Octa System Integration
 * Main system state initialization and management
 */

import type { QuadOctaSystemState } from '../types/index.js'

import { initializeBlueEngineCore, synchronizeAllForces } from './blue-engine-core.js'
import { initializeQuaOctaBus } from './qoa-octa-bus.js'
import { initializePPI, verifyAllRealms } from './ppi.js'
import { initializeBlueLock, sealBlueLock } from './blue-lock.js'
import { initiateHandshake, acknowledgeAllChannels } from './qoa-octa-handshake.js'
import { initializeGuaranteeEnvelope, addRedundantPath } from './guarantee-envelope.js'
import { initializeOrchestrationSchedule } from './orchestration.js'
import { createCausalityFences } from './causality-fence.js'
import { createGenesisLog } from './proof-of-placement.js'
import { validateCompliance } from './compliance.js'
import { createReciprocalInvariant } from './reciprocal-invariants.js'

/**
 * Initialize complete Quad-Octa system
 */
export function initializeQuadOctaSystem(
  authorizedKeys: string[] = ['system-admin'],
): QuadOctaSystemState {
  // 1. Initialize Blue Engine Core
  const bec = synchronizeAllForces(initializeBlueEngineCore())

  // 2. Initialize QuaOcta Bus
  const qob = initializeQuaOctaBus()

  // 3. Initialize PPI
  const ppi = verifyAllRealms(initializePPI())

  // 4. Initialize BlueLock
  const blueLock = sealBlueLock(initializeBlueLock(authorizedKeys))

  // 5. Create initial handshake
  const handshake = acknowledgeAllChannels(initiateHandshake(bec), bec.omega48)

  // 6. Initialize Guarantee Envelope
  let guaranteeEnvelope = initializeGuaranteeEnvelope('primary-path-0')
  guaranteeEnvelope = addRedundantPath(guaranteeEnvelope, 'redundant-path-1')
  guaranteeEnvelope = addRedundantPath(guaranteeEnvelope, 'redundant-path-2')

  // 7. Initialize Orchestration
  const orchestration = initializeOrchestrationSchedule()

  // 8. Initialize devices (empty initially)
  const devices: QuadOctaSystemState['devices'] = []

  // 9. Create causality fences
  const causalityFences = createCausalityFences(bec)

  // 10. Create genesis placement log
  const genesisLog = createGenesisLog(ppi, bec)

  // 11. Validate compliance
  const reciprocalInvariant = createReciprocalInvariant()
  const compliance = validateCompliance(
    ppi,
    blueLock,
    [handshake],
    [genesisLog],
    [reciprocalInvariant],
  )

  return {
    bec,
    qob,
    ppi,
    blueLock,
    handshakes: [handshake],
    guaranteeEnvelope,
    orchestration,
    devices,
    causalityFences,
    placementLogs: [genesisLog],
    compliance,
  }
}

/**
 * Get system health summary
 */
export function getSystemHealth(system: QuadOctaSystemState): {
  becHealthy: boolean
  qobHealthy: boolean
  ppiAligned: boolean
  blueLockIntact: boolean
  handshakesComplete: number
  causalityValid: boolean
  logsVerified: number
  overallHealth: number
} {
  const becHealthy = system.bec.harmonicsLocked
  const qobHealthy = system.qob.status === 'active'
  const ppiAligned = system.ppi.alignment >= 0.8
  const blueLockIntact = system.blueLock.integrity === 'intact'

  const handshakesComplete = system.handshakes.filter(
    (h) => h.complete && h.status === 'complete',
  ).length

  const causalityValid = system.causalityFences.every((f) => f.activationAllowed)

  const logsVerified = system.placementLogs.filter((log) => log.verified).length

  // Calculate overall health (0-100)
  const healthFactors = [
    becHealthy ? 1 : 0,
    qobHealthy ? 1 : 0,
    ppiAligned ? 1 : 0,
    blueLockIntact ? 1 : 0,
    handshakesComplete > 0 ? 1 : 0,
    causalityValid ? 1 : 0,
    logsVerified > 0 ? 1 : 0,
  ]

  const overallHealth =
    (healthFactors.reduce((sum, f) => sum + f, 0) / healthFactors.length) * 100

  return {
    becHealthy,
    qobHealthy,
    ppiAligned,
    blueLockIntact,
    handshakesComplete,
    causalityValid,
    logsVerified,
    overallHealth,
  }
}

/**
 * Export system state to JSON
 */
export function exportSystemState(system: QuadOctaSystemState): string {
  return JSON.stringify(
    {
      version: '1.0',
      timestamp: Date.now(),
      bec: {
        omega48: system.bec.omega48,
        phase: system.bec.phase,
        harmonicsLocked: system.bec.harmonicsLocked,
        clockRate: system.bec.clockRate,
      },
      qob: {
        status: system.qob.status,
        totalLanes: system.qob.totalLanes,
        bandwidth: system.qob.bandwidth,
      },
      ppi: {
        alignment: system.ppi.alignment,
        physicalVerified: system.ppi.physicalCoordinates.verified,
        metaVerified: system.ppi.metaCoordinates.verified,
        spiritualVerified: system.ppi.spiritualCoordinates.verified,
      },
      blueLock: {
        sealed: system.blueLock.sealed,
        integrity: system.blueLock.integrity,
        tamperAttempts: system.blueLock.tamperAttempts,
      },
      handshakes: system.handshakes.length,
      guaranteeEnvelope: {
        mode: system.guaranteeEnvelope.mode,
        ringRedundancy: system.guaranteeEnvelope.ringRedundancy,
        guarantee: system.guaranteeEnvelope.guarantee,
      },
      devices: system.devices.length,
      causalityFences: system.causalityFences.length,
      placementLogs: system.placementLogs.length,
      compliance: system.compliance.overallCompliance,
    },
    null,
    2,
  )
}
