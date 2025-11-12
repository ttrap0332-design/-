/**
 * BlueLock Security System
 * Tamper-proof system seals and unauthorized access prevention
 */

import type { BlueLock } from '../types/index.js'
import { createHash } from 'crypto'

/**
 * Initialize BlueLock security system
 */
export function initializeBlueLock(authorizedKeys: string[] = []): BlueLock {
  const timestamp = Date.now()
  const sealHash = generateSealHash(authorizedKeys, timestamp)

  return {
    sealed: false,
    sealHash,
    sealTimestamp: timestamp,
    authorizedKeys,
    tamperAttempts: 0,
    integrity: 'intact',
  }
}

/**
 * Generate seal hash from authorized keys and timestamp
 */
function generateSealHash(keys: string[], timestamp: number): string {
  const data = `${keys.sort().join('|')}|${timestamp}`
  return createHash('sha256').update(data).digest('hex')
}

/**
 * Seal the BlueLock system
 */
export function sealBlueLock(blueLock: BlueLock): BlueLock {
  const timestamp = Date.now()
  const sealHash = generateSealHash(blueLock.authorizedKeys, timestamp)

  return {
    ...blueLock,
    sealed: true,
    sealHash,
    sealTimestamp: timestamp,
    integrity: 'intact',
  }
}

/**
 * Verify BlueLock integrity
 */
export function verifyBlueLockIntegrity(blueLock: BlueLock): boolean {
  const expectedHash = generateSealHash(blueLock.authorizedKeys, blueLock.sealTimestamp)
  return blueLock.sealHash === expectedHash && blueLock.integrity === 'intact'
}

/**
 * Attempt to access BlueLock with a key
 */
export function accessBlueLock(blueLock: BlueLock, key: string): BlueLock {
  if (!blueLock.sealed) {
    // Not sealed, no access control needed
    return blueLock
  }

  const isAuthorized = blueLock.authorizedKeys.includes(key)

  if (isAuthorized) {
    // Authorized access - no changes
    return blueLock
  } else {
    // Unauthorized access attempt
    const tamperAttempts = blueLock.tamperAttempts + 1
    let integrity = blueLock.integrity

    if (tamperAttempts >= 3) {
      integrity = 'compromised'
    }
    if (tamperAttempts >= 5) {
      integrity = 'broken'
    }

    return {
      ...blueLock,
      tamperAttempts,
      integrity,
    }
  }
}

/**
 * Add authorized key to BlueLock
 */
export function addAuthorizedKey(blueLock: BlueLock, key: string): BlueLock {
  if (blueLock.sealed) {
    // Cannot add keys to sealed lock
    return blueLock
  }

  if (blueLock.authorizedKeys.includes(key)) {
    // Key already exists
    return blueLock
  }

  const updatedKeys = [...blueLock.authorizedKeys, key]
  const timestamp = Date.now()
  const sealHash = generateSealHash(updatedKeys, timestamp)

  return {
    ...blueLock,
    authorizedKeys: updatedKeys,
    sealHash,
    sealTimestamp: timestamp,
  }
}

/**
 * Remove authorized key from BlueLock
 */
export function removeAuthorizedKey(blueLock: BlueLock, key: string): BlueLock {
  if (blueLock.sealed) {
    // Cannot remove keys from sealed lock
    return blueLock
  }

  const updatedKeys = blueLock.authorizedKeys.filter((k) => k !== key)
  const timestamp = Date.now()
  const sealHash = generateSealHash(updatedKeys, timestamp)

  return {
    ...blueLock,
    authorizedKeys: updatedKeys,
    sealHash,
    sealTimestamp: timestamp,
  }
}

/**
 * Reset BlueLock (clear tamper attempts and restore integrity)
 * Requires unsealing first
 */
export function resetBlueLock(blueLock: BlueLock): BlueLock {
  if (blueLock.sealed) {
    // Cannot reset sealed lock
    return blueLock
  }

  return {
    ...blueLock,
    tamperAttempts: 0,
    integrity: 'intact',
  }
}

/**
 * Unseal BlueLock (requires authorized key)
 */
export function unsealBlueLock(blueLock: BlueLock, key: string): BlueLock {
  if (!blueLock.authorizedKeys.includes(key)) {
    // Unauthorized unseal attempt
    return accessBlueLock(blueLock, key)
  }

  return {
    ...blueLock,
    sealed: false,
  }
}

/**
 * Check if BlueLock is compromised
 */
export function isBlueLockCompromised(blueLock: BlueLock): boolean {
  return blueLock.integrity === 'compromised' || blueLock.integrity === 'broken'
}
