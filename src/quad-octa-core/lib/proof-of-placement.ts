/**
 * Proof-of-Placement Log (Scroll-hash)
 * Immutable, tamper-proof audit trail for system state
 */

import type {
  ProofOfPlacementLog,
  PihyahPlacementInterface,
  BlueEngineCore,
} from '../types/index.js'
import { createHash } from 'crypto'

/**
 * Create genesis proof-of-placement log (first in chain)
 */
export function createGenesisLog(
  ppi: PihyahPlacementInterface,
  bec: BlueEngineCore,
): ProofOfPlacementLog {
  const timestamp = Date.now()
  const scrollHash = calculateScrollHash(null, ppi, bec, timestamp)

  return {
    id: `POP-${timestamp}-GENESIS`,
    timestamp,
    scrollHash,
    previousHash: '0'.repeat(64), // Genesis has no previous
    ppiState: ppi,
    becState: bec,
    immutable: true,
    verified: true,
  }
}

/**
 * Create new proof-of-placement log (appends to chain)
 */
export function createProofOfPlacementLog(
  previousLog: ProofOfPlacementLog,
  ppi: PihyahPlacementInterface,
  bec: BlueEngineCore,
): ProofOfPlacementLog {
  const timestamp = Date.now()
  const scrollHash = calculateScrollHash(previousLog.scrollHash, ppi, bec, timestamp)

  return {
    id: `POP-${timestamp}-${scrollHash.substring(0, 8)}`,
    timestamp,
    scrollHash,
    previousHash: previousLog.scrollHash,
    ppiState: ppi,
    becState: bec,
    immutable: true,
    verified: false, // Needs verification
  }
}

/**
 * Calculate scroll-hash from system state
 */
function calculateScrollHash(
  previousHash: string | null,
  ppi: PihyahPlacementInterface,
  bec: BlueEngineCore,
  timestamp: number,
): string {
  const ppiData = JSON.stringify({
    physical: ppi.physicalCoordinates,
    meta: ppi.metaCoordinates,
    spiritual: ppi.spiritualCoordinates,
    alignment: ppi.alignment,
  })

  const becData = JSON.stringify({
    omega48: bec.omega48,
    phase: bec.phase,
    harmonicsLocked: bec.harmonicsLocked,
    forces: bec.forceStates.map((fs) => ({
      force: fs.force,
      amplitude: fs.amplitude,
      phase: fs.phase,
      synchronized: fs.synchronized,
    })),
  })

  const data = `${previousHash || ''}|${timestamp}|${ppiData}|${becData}`

  return createHash('sha256').update(data).digest('hex')
}

/**
 * Verify proof-of-placement log integrity
 */
export function verifyProofOfPlacementLog(log: ProofOfPlacementLog): boolean {
  if (!log.immutable) return false

  const expectedHash = calculateScrollHash(
    log.previousHash === '0'.repeat(64) ? null : log.previousHash,
    log.ppiState,
    log.becState,
    log.timestamp,
  )

  return expectedHash === log.scrollHash
}

/**
 * Verify chain of logs
 */
export function verifyLogChain(logs: ProofOfPlacementLog[]): boolean {
  if (logs.length === 0) return true

  // Verify first log is genesis
  if (logs[0].previousHash !== '0'.repeat(64)) {
    return false
  }

  // Verify each log
  for (let i = 0; i < logs.length; i++) {
    if (!verifyProofOfPlacementLog(logs[i])) {
      return false
    }

    // Verify chain linkage
    if (i > 0 && logs[i].previousHash !== logs[i - 1].scrollHash) {
      return false
    }
  }

  return true
}

/**
 * Mark log as verified
 */
export function markLogAsVerified(log: ProofOfPlacementLog): ProofOfPlacementLog {
  if (!verifyProofOfPlacementLog(log)) {
    return log
  }

  return {
    ...log,
    verified: true,
  }
}

/**
 * Get log chain summary
 */
export function getLogChainSummary(logs: ProofOfPlacementLog[]): {
  totalLogs: number
  verifiedLogs: number
  chainValid: boolean
  oldestTimestamp: number
  newestTimestamp: number
} {
  return {
    totalLogs: logs.length,
    verifiedLogs: logs.filter((log) => log.verified).length,
    chainValid: verifyLogChain(logs),
    oldestTimestamp: logs.length > 0 ? logs[0].timestamp : 0,
    newestTimestamp: logs.length > 0 ? logs[logs.length - 1].timestamp : 0,
  }
}

/**
 * Find log by ID
 */
export function findLogById(
  logs: ProofOfPlacementLog[],
  id: string,
): ProofOfPlacementLog | undefined {
  return logs.find((log) => log.id === id)
}

/**
 * Get logs in time range
 */
export function getLogsInTimeRange(
  logs: ProofOfPlacementLog[],
  startTime: number,
  endTime: number,
): ProofOfPlacementLog[] {
  return logs.filter((log) => log.timestamp >= startTime && log.timestamp <= endTime)
}

/**
 * Export log chain to JSON
 */
export function exportLogChain(logs: ProofOfPlacementLog[]): string {
  return JSON.stringify(
    {
      version: '1.0',
      chainValid: verifyLogChain(logs),
      logs: logs.map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        scrollHash: log.scrollHash,
        previousHash: log.previousHash,
        verified: log.verified,
        omega48: log.becState.omega48,
        phase: log.becState.phase,
        alignment: log.ppiState.alignment,
      })),
    },
    null,
    2,
  )
}
