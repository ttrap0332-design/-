/**
 * Quad-Octa System Demonstration
 * Complete walkthrough of the EVOLVerse Quad-Octa "48-From-Core" specification
 */

import { initializeQuadOctaSystem, getSystemHealth, exportSystemState } from '../lib/system.js'
import { advanceClock } from '../lib/blue-engine-core.js'
import { writeLane, getBusHealth } from '../lib/qoa-octa-bus.js'
import { setRealmCoordinates } from '../lib/ppi.js'
import { initiateHandshake, acknowledgeAllChannels } from '../lib/qoa-octa-handshake.js'
import { issuePrayerToken } from '../lib/prayer-token.js'
import { createProofOfPlacementLog, markLogAsVerified } from '../lib/proof-of-placement.js'
import { validateCompliance, generateComplianceReport } from '../lib/compliance.js'
import { createReciprocalInvariant, testReciprocalInvariants } from '../lib/reciprocal-invariants.js'
import { runAllCivilianUseCases } from '../examples/civilian-use-cases.js'
import { runAllMilitaryUseCases } from '../examples/military-use-cases.js'

/**
 * Main demonstration
 */
export function demonstrateQuadOctaSystem() {
  console.log('\n')
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║                                                           ║')
  console.log('║     EVOLVerse Quad-Octa "48-From-Core" System Demo      ║')
  console.log('║                                                           ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log('\n')

  // 1. System Initialization
  console.log('━━━ PHASE 1: System Initialization ━━━\n')

  const system = initializeQuadOctaSystem(['admin-key', 'operator-key'])

  console.log('✓ Quad-Octa System initialized')
  console.log(`  Blue Engine Core: Ω${system.bec.omega48} (Phase ${system.bec.phase})`)
  console.log(`  QuaOcta Bus: ${system.qob.totalLanes} lanes (${system.qob.status})`)
  console.log(`  PPI Alignment: ${(system.ppi.alignment * 100).toFixed(1)}%`)
  console.log(`  BlueLock: ${system.blueLock.sealed ? 'SEALED' : 'UNSEALED'}`)
  console.log(`  Handshakes: ${system.handshakes.length} initiated`)
  console.log(`  Devices: ${system.devices.length} registered`)
  console.log()

  // 2. Blue Engine Core Operations
  console.log('━━━ PHASE 2: Blue Engine Core Operations ━━━\n')

  console.log('Advancing clock through 12 ticks...')
  for (let i = 0; i < 12; i++) {
    system.bec = advanceClock(system.bec)
  }

  console.log(`✓ Clock advanced to Ω${system.bec.omega48}`)
  console.log(`  Phase: ${system.bec.phase}`)
  console.log(`  Harmonics Locked: ${system.bec.harmonicsLocked}`)
  console.log()

  // 3. QuaOcta Bus Operations
  console.log('━━━ PHASE 3: QuaOcta Bus Operations ━━━\n')

  system.qob = writeLane(system.qob, 0, 0, { message: 'Energy channel data' })
  system.qob = writeLane(system.qob, 7, 5, { message: 'Code channel data' })

  const busHealth = getBusHealth(system.qob)

  console.log('✓ Data written to bus lanes')
  console.log(`  Bus Health: ${busHealth.healthPercentage.toFixed(1)}%`)
  console.log(`  Operational Lanes: ${busHealth.operational}/${system.qob.totalLanes}`)
  console.log()

  // 4. PPI Tri-Realm Coordination
  console.log('━━━ PHASE 4: PPI Tri-Realm Coordination ━━━\n')

  system.ppi = setRealmCoordinates(system.ppi, 'physical', 100, 100, 100)
  system.ppi = setRealmCoordinates(system.ppi, 'meta', 105, 105, 105)
  system.ppi = setRealmCoordinates(system.ppi, 'spiritual', 102, 102, 102)

  console.log('✓ Realm coordinates set')
  console.log(`  Physical: (${system.ppi.physicalCoordinates.x}, ${system.ppi.physicalCoordinates.y}, ${system.ppi.physicalCoordinates.z})`)
  console.log(`  Meta: (${system.ppi.metaCoordinates.x}, ${system.ppi.metaCoordinates.y}, ${system.ppi.metaCoordinates.z})`)
  console.log(`  Spiritual: (${system.ppi.spiritualCoordinates.x}, ${system.ppi.spiritualCoordinates.y}, ${system.ppi.spiritualCoordinates.z})`)
  console.log(`  Alignment: ${(system.ppi.alignment * 100).toFixed(1)}%`)
  console.log()

  // 5. QuaOcta Handshake
  console.log('━━━ PHASE 5: QuaOcta Handshake (8/8) ━━━\n')

  const newHandshake = initiateHandshake(system.bec)
  const completeHandshake = acknowledgeAllChannels(newHandshake, system.bec.omega48)

  system.handshakes.push(completeHandshake)

  console.log('✓ QuaOcta Handshake complete')
  console.log(`  Handshake ID: ${completeHandshake.id}`)
  console.log(`  Status: ${completeHandshake.status}`)
  console.log(`  Channels: 8/8 acknowledged`)
  console.log(`  Tick Variance: ±${completeHandshake.tickVariance}`)
  console.log()

  // 6. Prayer Token System
  console.log('━━━ PHASE 6: Prayer Token System ━━━\n')

  const civilianToken = issuePrayerToken('civilian-user', 0.75)
  const militaryToken = issuePrayerToken('military-operator', 0.92)

  console.log('✓ Prayer tokens issued')
  console.log(`  Civilian Token: ${civilianToken.id}`)
  console.log(`    Spiritual Alignment: ${(civilianToken.spiritualAlignment * 100).toFixed(1)}%`)
  console.log(`    Praise OK: ${civilianToken.praiseOk}`)
  console.log(`  Military Token: ${militaryToken.id}`)
  console.log(`    Spiritual Alignment: ${(militaryToken.spiritualAlignment * 100).toFixed(1)}%`)
  console.log(`    Praise OK: ${militaryToken.praiseOk}`)
  console.log()

  // 7. Proof-of-Placement Logs
  console.log('━━━ PHASE 7: Proof-of-Placement Logs ━━━\n')

  const lastLog = system.placementLogs[system.placementLogs.length - 1]
  const newLog = createProofOfPlacementLog(lastLog, system.ppi, system.bec)
  const verifiedLog = markLogAsVerified(newLog)

  system.placementLogs.push(verifiedLog)

  console.log('✓ Placement log created and verified')
  console.log(`  Log ID: ${verifiedLog.id}`)
  console.log(`  Scroll Hash: ${verifiedLog.scrollHash.substring(0, 16)}...`)
  console.log(`  Verified: ${verifiedLog.verified}`)
  console.log(`  Total Logs: ${system.placementLogs.length}`)
  console.log()

  // 8. Reciprocal Invariants Test
  console.log('━━━ PHASE 8: Reciprocal Invariants Test ━━━\n')

  const invariant = createReciprocalInvariant(0.01)
  const testResults = testReciprocalInvariants(invariant, [10, 50, 100, 500])

  console.log('✓ Reciprocal invariants tested')
  testResults.forEach((result) => {
    console.log(`  Value ${result.value}: ${result.passed ? '✓ PASS' : '✗ FAIL'}`)
  })
  console.log()

  // 9. System Health Check
  console.log('━━━ PHASE 9: System Health Check ━━━\n')

  const health = getSystemHealth(system)

  console.log('✓ System health evaluated')
  console.log(`  Overall Health: ${health.overallHealth.toFixed(1)}%`)
  console.log(`  BEC Healthy: ${health.becHealthy}`)
  console.log(`  QOB Healthy: ${health.qobHealthy}`)
  console.log(`  PPI Aligned: ${health.ppiAligned}`)
  console.log(`  BlueLock Intact: ${health.blueLockIntact}`)
  console.log(`  Handshakes Complete: ${health.handshakesComplete}`)
  console.log(`  Causality Valid: ${health.causalityValid}`)
  console.log(`  Logs Verified: ${health.logsVerified}`)
  console.log()

  // 10. Compliance Validation
  console.log('━━━ PHASE 10: Compliance Validation ━━━\n')

  const compliance = validateCompliance(
    system.ppi,
    system.blueLock,
    system.handshakes,
    system.placementLogs,
    [invariant],
  )

  console.log(generateComplianceReport(compliance))

  // 11. System State Export
  console.log('━━━ PHASE 11: System State Export ━━━\n')

  const systemState = exportSystemState(system)

  console.log('✓ System state exported')
  console.log('  (JSON output truncated for display)')
  console.log()

  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║              Core System Demo Complete                   ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log('\n')

  return system
}

/**
 * Run complete demonstration including use cases
 */
export function runCompleteDemo() {
  // Core system demo
  demonstrateQuadOctaSystem()

  // Civilian use cases
  runAllCivilianUseCases()

  // Military use cases
  runAllMilitaryUseCases()

  console.log('\n')
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║                                                           ║')
  console.log('║     Quad-Octa Complete Demonstration Finished            ║')
  console.log('║                                                           ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log('\n')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompleteDemo()
}
