/**
 * Pihyah Placement Interface (PPI)
 * Tri-realm coordinate assignment: physical, meta, spiritual
 */

import type {
  PihyahPlacementInterface,
  RealmCoordinates,
} from '../types/index.js'

/**
 * Initialize PPI with default coordinates
 */
export function initializePPI(): PihyahPlacementInterface {
  return {
    physicalCoordinates: {
      x: 0,
      y: 0,
      z: 0,
      realm: 'physical',
      verified: false,
    },
    metaCoordinates: {
      x: 0,
      y: 0,
      z: 0,
      realm: 'meta',
      verified: false,
    },
    spiritualCoordinates: {
      x: 0,
      y: 0,
      z: 0,
      realm: 'spiritual',
      verified: false,
    },
    alignment: 0,
    timestamp: Date.now(),
  }
}

/**
 * Set coordinates for a specific realm
 */
export function setRealmCoordinates(
  ppi: PihyahPlacementInterface,
  realm: 'physical' | 'meta' | 'spiritual',
  x: number,
  y: number,
  z: number,
): PihyahPlacementInterface {
  const coords: RealmCoordinates = {
    x,
    y,
    z,
    realm,
    verified: true,
  }

  const updated = { ...ppi }
  if (realm === 'physical') {
    updated.physicalCoordinates = coords
  } else if (realm === 'meta') {
    updated.metaCoordinates = coords
  } else {
    updated.spiritualCoordinates = coords
  }

  updated.timestamp = Date.now()
  updated.alignment = calculateAlignment(updated)

  return updated
}

/**
 * Calculate alignment score across all three realms
 * Returns 0-1 where 1 is perfect alignment
 */
export function calculateAlignment(ppi: PihyahPlacementInterface): number {
  const { physicalCoordinates: p, metaCoordinates: m, spiritualCoordinates: s } = ppi

  // Calculate distances between realms
  const pmDistance = Math.sqrt(
    Math.pow(p.x - m.x, 2) + Math.pow(p.y - m.y, 2) + Math.pow(p.z - m.z, 2),
  )
  const psDistance = Math.sqrt(
    Math.pow(p.x - s.x, 2) + Math.pow(p.y - s.y, 2) + Math.pow(p.z - s.z, 2),
  )
  const msDistance = Math.sqrt(
    Math.pow(m.x - s.x, 2) + Math.pow(m.y - s.y, 2) + Math.pow(m.z - s.z, 2),
  )

  // Average distance normalized (closer = better alignment)
  const avgDistance = (pmDistance + psDistance + msDistance) / 3
  // Normalize to 0-1 (assuming max reasonable distance is 1000)
  const normalizedDistance = Math.min(avgDistance / 1000, 1)

  // Verification factor
  const verifiedCount = [p.verified, m.verified, s.verified].filter(Boolean).length
  const verificationFactor = verifiedCount / 3

  // Alignment score (inverse of distance, weighted by verification)
  return (1 - normalizedDistance) * verificationFactor
}

/**
 * Verify all realm coordinates
 */
export function verifyAllRealms(ppi: PihyahPlacementInterface): PihyahPlacementInterface {
  return {
    ...ppi,
    physicalCoordinates: { ...ppi.physicalCoordinates, verified: true },
    metaCoordinates: { ...ppi.metaCoordinates, verified: true },
    spiritualCoordinates: { ...ppi.spiritualCoordinates, verified: true },
    alignment: calculateAlignment({
      ...ppi,
      physicalCoordinates: { ...ppi.physicalCoordinates, verified: true },
      metaCoordinates: { ...ppi.metaCoordinates, verified: true },
      spiritualCoordinates: { ...ppi.spiritualCoordinates, verified: true },
    }),
    timestamp: Date.now(),
  }
}

/**
 * Check if PPI is fully aligned (alignment > 0.8)
 */
export function isFullyAligned(ppi: PihyahPlacementInterface): boolean {
  return ppi.alignment > 0.8
}

/**
 * Get realm coordinates
 */
export function getRealmCoordinates(
  ppi: PihyahPlacementInterface,
  realm: 'physical' | 'meta' | 'spiritual',
): RealmCoordinates {
  if (realm === 'physical') return ppi.physicalCoordinates
  if (realm === 'meta') return ppi.metaCoordinates
  return ppi.spiritualCoordinates
}
