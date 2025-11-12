/**
 * Compliance Validation System
 * Automates validation for Quad-Octa operational readiness
 */

import type {
  ComplianceValidation,
  PihyahPlacementInterface,
  BlueLock,
  QuaOctaHandshake,
  ProofOfPlacementLog,
  ReciprocalInvariant,
} from '../types/index.js'

import { isFullyAligned } from './ppi.js'
import { verifyBlueLockIntegrity } from './blue-lock.js'
import { isHandshakeComplete } from './qoa-octa-handshake.js'
import { verifyReciprocalInvariant } from './reciprocal-invariants.js'
import { verifyProofOfPlacementLog } from './proof-of-placement.js'

/**
 * Perform complete compliance validation
 */
export function validateCompliance(
  ppi: PihyahPlacementInterface,
  blueLock: BlueLock,
  handshakes: QuaOctaHandshake[],
  placementLogs: ProofOfPlacementLog[],
  reciprocalInvariants: ReciprocalInvariant[],
  testValues: number[] = [10, 50, 100],
): ComplianceValidation {
  const issues: string[] = []

  // 1. PPI Compliance
  const ppiCompliant = isFullyAligned(ppi)
  if (!ppiCompliant) {
    issues.push(`PPI not fully aligned (alignment: ${ppi.alignment.toFixed(2)})`)
  }

  // 2. BlueLock Integrity
  const blueLockIntact = verifyBlueLockIntegrity(blueLock)
  if (!blueLockIntact) {
    issues.push(
      `BlueLock integrity compromised (status: ${blueLock.integrity}, tamper attempts: ${blueLock.tamperAttempts})`,
    )
  }

  // 3. QOH Success
  const successfulHandshakes = handshakes.filter((h) => isHandshakeComplete(h))
  const qohSuccess = successfulHandshakes.length > 0
  if (!qohSuccess) {
    issues.push(
      `No successful QuaOcta Handshakes (${handshakes.length} attempted, ${successfulHandshakes.length} completed)`,
    )
  }

  // 4. Reciprocal Tests
  let reciprocalTestsPassed = true
  for (const invariant of reciprocalInvariants) {
    for (const testValue of testValues) {
      if (!verifyReciprocalInvariant(invariant, testValue)) {
        reciprocalTestsPassed = false
        issues.push(
          `Reciprocal invariant failed for test value ${testValue} (tolerance: ${invariant.tolerance})`,
        )
        break
      }
    }
    if (!reciprocalTestsPassed) break
  }

  // 5. Scroll-hash Validation
  let scrollHashValid = true
  for (const log of placementLogs) {
    if (!verifyProofOfPlacementLog(log)) {
      scrollHashValid = false
      issues.push(`Proof-of-Placement log ${log.id} failed verification`)
      break
    }
  }

  // Overall compliance
  const overallCompliance =
    ppiCompliant &&
    blueLockIntact &&
    qohSuccess &&
    reciprocalTestsPassed &&
    scrollHashValid

  return {
    timestamp: Date.now(),
    ppiCompliant,
    blueLockIntact,
    qohSuccess,
    reciprocalTestsPassed,
    scrollHashValid,
    overallCompliance,
    issues,
  }
}

/**
 * Generate compliance report
 */
export function generateComplianceReport(validation: ComplianceValidation): string {
  const status = validation.overallCompliance ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'

  let report = `=== QUAD-OCTA COMPLIANCE VALIDATION ===\n`
  report += `Status: ${status}\n`
  report += `Timestamp: ${new Date(validation.timestamp).toISOString()}\n\n`

  report += `Components:\n`
  report += `  PPI Alignment:        ${validation.ppiCompliant ? '✓ Pass' : '✗ Fail'}\n`
  report += `  BlueLock Integrity:   ${validation.blueLockIntact ? '✓ Pass' : '✗ Fail'}\n`
  report += `  QOH Success:          ${validation.qohSuccess ? '✓ Pass' : '✗ Fail'}\n`
  report += `  Reciprocal Tests:     ${validation.reciprocalTestsPassed ? '✓ Pass' : '✗ Fail'}\n`
  report += `  Scroll-hash Valid:    ${validation.scrollHashValid ? '✓ Pass' : '✗ Fail'}\n\n`

  if (validation.issues.length > 0) {
    report += `Issues:\n`
    validation.issues.forEach((issue, index) => {
      report += `  ${index + 1}. ${issue}\n`
    })
  } else {
    report += `No issues detected.\n`
  }

  return report
}

/**
 * Quick compliance check (returns boolean)
 */
export function isCompliant(validation: ComplianceValidation): boolean {
  return validation.overallCompliance
}

/**
 * Get compliance score (0-100)
 */
export function getComplianceScore(validation: ComplianceValidation): number {
  const checks = [
    validation.ppiCompliant,
    validation.blueLockIntact,
    validation.qohSuccess,
    validation.reciprocalTestsPassed,
    validation.scrollHashValid,
  ]

  const passedChecks = checks.filter(Boolean).length
  return (passedChecks / checks.length) * 100
}

/**
 * Get critical issues only
 */
export function getCriticalIssues(validation: ComplianceValidation): string[] {
  const criticalKeywords = ['compromised', 'broken', 'failed']

  return validation.issues.filter((issue) =>
    criticalKeywords.some((keyword) => issue.toLowerCase().includes(keyword)),
  )
}

/**
 * Export compliance validation to JSON
 */
export function exportComplianceValidation(validation: ComplianceValidation): string {
  return JSON.stringify(
    {
      timestamp: new Date(validation.timestamp).toISOString(),
      overallCompliance: validation.overallCompliance,
      complianceScore: getComplianceScore(validation),
      components: {
        ppi: validation.ppiCompliant,
        blueLock: validation.blueLockIntact,
        qoh: validation.qohSuccess,
        reciprocal: validation.reciprocalTestsPassed,
        scrollHash: validation.scrollHashValid,
      },
      issues: validation.issues,
      criticalIssues: getCriticalIssues(validation),
    },
    null,
    2,
  )
}
