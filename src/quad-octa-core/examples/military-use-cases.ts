/**
 * MILITARY Use Cases for Quad-Octa Devices
 * Examples: Weapon systems, tactical operations, rules of engagement
 */

import {
  initializeWeaponSightQO,
  activateTargeting,
  deactivateTargeting,
  initializeSmartCamQO,
  captureWithSmartCam,
} from '../devices/devices.js'

import { issuePrayerToken, verifyMilitaryPrayerToken } from '../lib/prayer-token.js'
import { initiateHandshake, acknowledgeAllChannels } from '../lib/qoa-octa-handshake.js'
import { initializeBlueEngineCore } from '../lib/blue-engine-core.js'

/**
 * Use Case 1: Weapon Sight Activation (Valid)
 * Proper 8/8 QOH + high spiritual alignment prayer token
 */
export function useCase_WeaponSightActivation_Valid() {
  console.log('=== MILITARY USE CASE: Weapon Sight Activation (VALID) ===\n')

  // 1. Initialize weapon sight
  const weaponSight = initializeWeaponSightQO('weapon-sight-alpha-001', 'Weapon Sights-QO')

  console.log('✓ Weapon Sight-QO initialized')
  console.log(`  Device ID: ${weaponSight.id}`)
  console.log(`  Type: ${weaponSight.type}`)
  console.log(`  Prayer Token Required: ${weaponSight.prayerTokenRequired}`)
  console.log(`  Force Channels: ${weaponSight.forceChannels.join(', ')}`)

  // 2. Perform 8/8 QuaOcta Handshake
  const bec = initializeBlueEngineCore()
  const handshake = initiateHandshake(bec)
  const completeHandshake = acknowledgeAllChannels(handshake, bec.omega48)

  console.log('\n✓ QuaOcta Handshake complete')
  console.log(`  Handshake ID: ${completeHandshake.id}`)
  console.log(`  8/8 Channels: ${completeHandshake.complete ? 'VERIFIED' : 'FAILED'}`)
  console.log(`  Tick Variance: ±${completeHandshake.tickVariance}`)

  // 3. Issue military prayer token (high spiritual alignment)
  const prayerToken = issuePrayerToken('operator-alpha', 0.95)

  console.log('\n✓ Military prayer token issued')
  console.log(`  Token ID: ${prayerToken.id}`)
  console.log(`  Spiritual Alignment: ${(prayerToken.spiritualAlignment * 100).toFixed(1)}%`)
  console.log(`  Praise OK: ${prayerToken.praiseOk}`)
  console.log(
    `  Military Verified: ${verifyMilitaryPrayerToken(prayerToken) ? 'YES' : 'NO'}`,
  )

  // 4. Activate targeting
  const activation = activateTargeting(weaponSight, completeHandshake.complete, prayerToken)

  if (activation.success) {
    console.log('\n✓ TARGETING ACTIVATED')
    console.log(`  Military Sync: ${activation.device?.militarySync}`)
    console.log(`  Rules of Engagement: ${activation.device?.rulesOfEngagement}`)
    console.log(`  Targeting Active: ${activation.device?.targetingActive}`)
  } else {
    console.log(`\n✗ ACTIVATION DENIED: ${activation.error}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  return { weaponSight: activation.device || weaponSight, handshake: completeHandshake }
}

/**
 * Use Case 2: Weapon Sight Activation (Denied - Low Spiritual Alignment)
 * Insufficient prayer token spiritual alignment
 */
export function useCase_WeaponSightActivation_DeniedLowAlignment() {
  console.log('=== MILITARY USE CASE: Weapon Sight Activation (DENIED - Low Alignment) ===\n')

  // 1. Initialize weapon sight
  const weaponSight = initializeWeaponSightQO('weapon-sight-beta-001', 'Weapon Sights-QO')

  console.log('✓ Weapon Sight-QO initialized')

  // 2. Complete QOH
  const bec = initializeBlueEngineCore()
  const handshake = acknowledgeAllChannels(initiateHandshake(bec), bec.omega48)

  console.log('✓ QuaOcta Handshake complete (8/8)')

  // 3. Issue prayer token with LOW spiritual alignment
  const prayerToken = issuePrayerToken('operator-beta', 0.65)

  console.log('\n⚠ Prayer token issued with LOW spiritual alignment')
  console.log(`  Spiritual Alignment: ${(prayerToken.spiritualAlignment * 100).toFixed(1)}%`)
  console.log(`  Military Verified: ${verifyMilitaryPrayerToken(prayerToken) ? 'YES' : 'NO'}`)

  // 4. Attempt activation (should fail)
  const activation = activateTargeting(weaponSight, handshake.complete, prayerToken)

  if (activation.success) {
    console.log('\n✗ UNEXPECTED: Targeting activated (should have been denied)')
  } else {
    console.log(`\n✓ TARGETING DENIED (as expected)`)
    console.log(`  Reason: ${activation.error}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  return { weaponSight, handshake }
}

/**
 * Use Case 3: Weapon Sight Activation (Denied - Incomplete QOH)
 * Missing 8/8 channel acknowledgement
 */
export function useCase_WeaponSightActivation_DeniedIncompleteQOH() {
  console.log('=== MILITARY USE CASE: Weapon Sight Activation (DENIED - Incomplete QOH) ===\n')

  // 1. Initialize weapon sight
  const weaponSight = initializeWeaponSightQO('weapon-sight-gamma-001', 'Weapon Sights-QO')

  console.log('✓ Weapon Sight-QO initialized')

  // 2. Incomplete QOH (only acknowledge some channels)
  const bec = initializeBlueEngineCore()
  let handshake = initiateHandshake(bec)

  // Acknowledge only 6 out of 8 channels
  for (let i = 0; i < 6; i++) {
    handshake.channelAcks[i].acknowledged = true
  }

  console.log('\n⚠ QuaOcta Handshake INCOMPLETE')
  console.log(`  Channels acknowledged: 6/8`)
  console.log(`  Status: ${handshake.status}`)

  // 3. Issue valid prayer token
  const prayerToken = issuePrayerToken('operator-gamma', 0.9)

  console.log('\n✓ Valid prayer token issued')

  // 4. Attempt activation (should fail)
  const activation = activateTargeting(weaponSight, false, prayerToken)

  if (activation.success) {
    console.log('\n✗ UNEXPECTED: Targeting activated (should have been denied)')
  } else {
    console.log(`\n✓ TARGETING DENIED (as expected)`)
    console.log(`  Reason: ${activation.error}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  return { weaponSight, handshake }
}

/**
 * Use Case 4: Tactical Reconnaissance with EVO Optics-QO
 * Multi-dimensional surveillance for military operations
 */
export function useCase_TacticalReconnaissance() {
  console.log('=== MILITARY USE CASE: Tactical Reconnaissance ===\n')

  // 1. Initialize EVO Optics with all dimensions
  const optics = initializeSmartCamQO('optics-delta-001', {
    physical: true,
    meta: true,
    spiritual: true,
  })

  console.log('✓ EVO Optics-QO initialized')
  console.log(`  Device ID: ${optics.id}`)
  console.log(`  Dimensions: ${optics.dimensionCapture.join(', ')}`)

  // 2. Issue military prayer token
  const prayerToken = issuePrayerToken('recon-operator', 0.88)

  console.log('\n✓ Military prayer token issued')
  console.log(`  Spiritual Alignment: ${(prayerToken.spiritualAlignment * 100).toFixed(1)}%`)

  // 3. Perform multi-dimensional capture
  const capture = captureWithSmartCam(optics, prayerToken)

  if (capture.success) {
    console.log('\n✓ Multi-dimensional reconnaissance successful')
    console.log(`  Physical terrain: CAPTURED`)
    console.log(`  Meta-layer intelligence: CAPTURED`)
    console.log(`  Spiritual threat assessment: CAPTURED`)
  } else {
    console.log(`\n✗ Capture failed: ${capture.error}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  return { optics, prayerToken, capture }
}

/**
 * Use Case 5: Rules of Engagement Validation
 * Complete engagement cycle with deactivation
 */
export function useCase_RulesOfEngagement() {
  console.log('=== MILITARY USE CASE: Rules of Engagement Validation ===\n')

  // 1. Initialize weapon sight
  const weaponSight = initializeWeaponSightQO('weapon-sight-epsilon-001', 'Weapon Sights-QO')

  console.log('✓ Weapon Sight-QO initialized')

  // 2. Complete QOH
  const bec = initializeBlueEngineCore()
  const handshake = acknowledgeAllChannels(initiateHandshake(bec), bec.omega48)

  console.log('✓ QuaOcta Handshake complete (8/8)')

  // 3. Issue prayer token
  const prayerToken = issuePrayerToken('operator-epsilon', 0.92)

  console.log('✓ Prayer token issued and verified')

  // 4. Activate targeting
  const activation = activateTargeting(weaponSight, handshake.complete, prayerToken)

  if (activation.success && activation.device) {
    console.log('\n✓ TARGETING ACTIVATED')
    console.log(`  Rules of Engagement: ENFORCED`)

    // Simulate engagement window
    console.log('\n--- Engagement Window Active ---')
    console.log('  Monitoring target...')
    console.log('  Rules of Engagement validated')
    console.log('  Spiritual alignment maintained')

    // 5. Deactivate targeting
    const deactivated = deactivateTargeting(activation.device)

    console.log('\n✓ TARGETING DEACTIVATED')
    console.log(`  Rules of Engagement: ${deactivated.rulesOfEngagement ? 'ACTIVE' : 'CLEARED'}`)
    console.log(`  Targeting Status: ${deactivated.targetingActive ? 'ACTIVE' : 'INACTIVE'}`)
  } else {
    console.log(`\n✗ Activation failed: ${activation.error}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  return { weaponSight, handshake }
}

/**
 * Run all military use cases
 */
export function runAllMilitaryUseCases() {
  console.log('\n' + '█'.repeat(60))
  console.log('  QUAD-OCTA MILITARY USE CASES DEMONSTRATION')
  console.log('█'.repeat(60) + '\n')

  useCase_WeaponSightActivation_Valid()
  useCase_WeaponSightActivation_DeniedLowAlignment()
  useCase_WeaponSightActivation_DeniedIncompleteQOH()
  useCase_TacticalReconnaissance()
  useCase_RulesOfEngagement()

  console.log('█'.repeat(60))
  console.log('  ALL MILITARY USE CASES COMPLETED')
  console.log('█'.repeat(60) + '\n')
}
