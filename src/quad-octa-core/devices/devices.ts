/**
 * Quad-Octa Compliant Devices
 * Device implementations for EVO SmartCam, SmartSound, SmartAds, and Weapon Sights
 */

import type {
  QuadOctaDevice,
  SmartCamQO,
  SmartSoundQO,
  SmartAdQO,
  WeaponSightQO,
  DeviceType,
  QuadOctaForce,
  PrayerToken,
  HarmonicBand,
  MultiDimensionalAperture,
} from '../types/index.js'

import { isPrayerTokenValid, verifyMilitaryPrayerToken } from '../lib/prayer-token.js'

/**
 * Initialize EVO SmartCam-QO with multi-dimensional aperture
 */
export function initializeSmartCamQO(
  id: string,
  dimensions: {
    physical: boolean
    meta: boolean
    spiritual: boolean
  },
): SmartCamQO {
  const aperture: MultiDimensionalAperture = {
    physical: dimensions.physical,
    meta: dimensions.meta,
    spiritual: dimensions.spiritual,
    resolution: 1080,
  }

  const dimensionCapture: string[] = []
  if (dimensions.physical) dimensionCapture.push('physical')
  if (dimensions.meta) dimensionCapture.push('meta')
  if (dimensions.spiritual) dimensionCapture.push('spiritual')

  return {
    id,
    type: 'EVO SmartCam-QO',
    compliant: true,
    forceChannels: ['Light', 'Spirit'],
    qohCapable: true,
    prayerTokenRequired: dimensions.spiritual, // Require token for spiritual capture
    lastSync: Date.now(),
    aperture,
    dimensionCapture,
  }
}

/**
 * Capture from SmartCam-QO
 */
export function captureWithSmartCam(
  camera: SmartCamQO,
  prayerToken?: PrayerToken,
): { success: boolean; data?: unknown; error?: string } {
  if (camera.prayerTokenRequired && !prayerToken) {
    return {
      success: false,
      error: 'Prayer token required for spiritual dimension capture',
    }
  }

  if (prayerToken && !isPrayerTokenValid(prayerToken)) {
    return {
      success: false,
      error: 'Prayer token invalid or expired',
    }
  }

  const captureData = {
    timestamp: Date.now(),
    deviceId: camera.id,
    dimensions: camera.dimensionCapture,
    resolution: camera.aperture.resolution,
    spiritualAlignment: prayerToken?.spiritualAlignment || 0,
  }

  return {
    success: true,
    data: captureData,
  }
}

/**
 * Initialize SmartSound-QO with 8-band harmonic emission
 */
export function initializeSmartSoundQO(id: string, emissionPower: number = 100): SmartSoundQO {
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

  const harmonicBands: HarmonicBand[] = forces.map((force, index) => ({
    force,
    frequency: 432 * Math.pow(2, index / 8), // Based on 432Hz tuning
    amplitude: emissionPower / 8,
    phase: index * (360 / 8), // Evenly distributed phases
  }))

  return {
    id,
    type: 'SmartSound-QO',
    compliant: true,
    forceChannels: forces,
    qohCapable: true,
    prayerTokenRequired: false,
    lastSync: Date.now(),
    harmonicBands,
    emissionPower,
  }
}

/**
 * Emit harmonic from SmartSound-QO
 */
export function emitHarmonic(
  device: SmartSoundQO,
  force: QuadOctaForce,
): { success: boolean; frequency?: number; amplitude?: number; error?: string } {
  const band = device.harmonicBands.find((b) => b.force === force)

  if (!band) {
    return {
      success: false,
      error: `No harmonic band found for force ${force}`,
    }
  }

  return {
    success: true,
    frequency: band.frequency,
    amplitude: band.amplitude,
  }
}

/**
 * Initialize SmartPoster/SmartAd-QO for market/culture events
 */
export function initializeSmartAdQO(
  id: string,
  type: 'SmartPosters-QO' | 'SmartAds-QO',
  eventType: 'market' | 'culture',
): SmartAdQO {
  return {
    id,
    type,
    compliant: true,
    forceChannels: ['Code', 'Light', 'Sound'],
    qohCapable: true,
    prayerTokenRequired: eventType === 'culture', // Culture events require spiritual alignment
    lastSync: Date.now(),
    eventType,
    qohValidations: 0,
    audience: [],
  }
}

/**
 * Publish event via SmartAd-QO
 */
export function publishEvent(
  device: SmartAdQO,
  eventData: unknown,
  qohComplete: boolean,
  prayerToken?: PrayerToken,
): { success: boolean; validations?: number; error?: string } {
  if (!qohComplete) {
    return {
      success: false,
      error: 'QuaOcta Handshake not complete - event publishing denied',
    }
  }

  if (device.prayerTokenRequired && !prayerToken) {
    return {
      success: false,
      error: 'Prayer token required for culture event',
    }
  }

  if (prayerToken && !isPrayerTokenValid(prayerToken)) {
    return {
      success: false,
      error: 'Prayer token invalid',
    }
  }

  const updatedValidations = device.qohValidations + 1

  return {
    success: true,
    validations: updatedValidations,
  }
}

/**
 * Initialize EVO Optics/Weapon Sights-QO for military sync
 */
export function initializeWeaponSightQO(
  id: string,
  type: 'EVO Optics-QO' | 'Weapon Sights-QO',
): WeaponSightQO {
  return {
    id,
    type,
    compliant: true,
    forceChannels: ['Light', 'Spirit', 'Energy', 'Motion'],
    qohCapable: true,
    prayerTokenRequired: true, // Military operations ALWAYS require prayer token
    lastSync: Date.now(),
    militarySync: false,
    rulesOfEngagement: false,
    targetingActive: false,
  }
}

/**
 * Activate targeting on weapon sight (requires 8/8 QOH + prayer token)
 */
export function activateTargeting(
  device: WeaponSightQO,
  qohComplete: boolean,
  prayerToken: PrayerToken,
): {
  success: boolean
  device?: WeaponSightQO
  error?: string
} {
  if (!qohComplete) {
    return {
      success: false,
      error: 'QuaOcta Handshake incomplete - 8/8 channels required',
    }
  }

  if (!verifyMilitaryPrayerToken(prayerToken)) {
    return {
      success: false,
      error: 'Military prayer token verification failed - spiritual alignment insufficient',
    }
  }

  const updatedDevice: WeaponSightQO = {
    ...device,
    militarySync: true,
    rulesOfEngagement: true,
    targetingActive: true,
    prayerToken,
    lastSync: Date.now(),
  }

  return {
    success: true,
    device: updatedDevice,
  }
}

/**
 * Deactivate targeting
 */
export function deactivateTargeting(device: WeaponSightQO): WeaponSightQO {
  return {
    ...device,
    targetingActive: false,
    rulesOfEngagement: false,
    prayerToken: undefined,
  }
}

/**
 * Check device compliance
 */
export function checkDeviceCompliance(device: QuadOctaDevice): {
  compliant: boolean
  issues: string[]
} {
  const issues: string[] = []

  if (!device.qohCapable) {
    issues.push('Device is not QOH capable')
  }

  if (device.forceChannels.length < 2) {
    issues.push('Device must support at least 2 force channels')
  }

  const timeSinceSync = Date.now() - device.lastSync
  const maxSyncAge = 3600000 // 1 hour
  if (timeSinceSync > maxSyncAge) {
    issues.push(`Device sync outdated (${Math.floor(timeSinceSync / 60000)} minutes old)`)
  }

  return {
    compliant: issues.length === 0 && device.compliant,
    issues,
  }
}

/**
 * Synchronize device with current Ω48 tick
 */
export function synchronizeDevice<T extends QuadOctaDevice>(device: T): T {
  return {
    ...device,
    lastSync: Date.now(),
  }
}
