/**
 * Prayer Token System - Rites Gate Validation
 * Implements praise_ok validation for spiritual alignment
 */

import type { PrayerToken } from '../types/index.js'
import { createHash } from 'crypto'

/**
 * Issue a new prayer token
 */
export function issuePrayerToken(
  issuer: string,
  spiritualAlignment: number,
  validityDuration: number = 3600000, // 1 hour default
): PrayerToken {
  const timestamp = Date.now()
  const praiseOk = validatePraise(spiritualAlignment)

  return {
    id: generateTokenId(issuer, timestamp),
    issuer,
    timestamp,
    praiseOk,
    spiritualAlignment: Math.max(0, Math.min(1, spiritualAlignment)),
    expiresAt: timestamp + validityDuration,
    used: false,
  }
}

/**
 * Generate unique token ID
 */
function generateTokenId(issuer: string, timestamp: number): string {
  const data = `${issuer}|${timestamp}|${Math.random()}`
  return `PT-${createHash('sha256').update(data).digest('hex').substring(0, 16)}`
}

/**
 * Validate praise based on spiritual alignment
 * Returns true if alignment is >= 0.7
 */
function validatePraise(spiritualAlignment: number): boolean {
  return spiritualAlignment >= 0.7
}

/**
 * Check if prayer token is valid
 */
export function isPrayerTokenValid(token: PrayerToken): boolean {
  const now = Date.now()
  return token.praiseOk && !token.used && now < token.expiresAt
}

/**
 * Use a prayer token (marks it as used)
 */
export function usePrayerToken(token: PrayerToken): PrayerToken {
  return {
    ...token,
    used: true,
  }
}

/**
 * Renew a prayer token (extends expiration)
 */
export function renewPrayerToken(
  token: PrayerToken,
  additionalDuration: number = 3600000,
): PrayerToken {
  if (token.used) {
    // Cannot renew used token
    return token
  }

  return {
    ...token,
    expiresAt: token.expiresAt + additionalDuration,
  }
}

/**
 * Verify prayer token for military operations
 * Requires both praise_ok and high spiritual alignment (>= 0.8)
 */
export function verifyMilitaryPrayerToken(token: PrayerToken): boolean {
  return isPrayerTokenValid(token) && token.spiritualAlignment >= 0.8
}

/**
 * Check if prayer token is expired
 */
export function isPrayerTokenExpired(token: PrayerToken): boolean {
  return Date.now() >= token.expiresAt
}

/**
 * Get time remaining on prayer token (in milliseconds)
 */
export function getTokenTimeRemaining(token: PrayerToken): number {
  const remaining = token.expiresAt - Date.now()
  return Math.max(0, remaining)
}
