/**
 * Reciprocal Invariants and Cross-Domain Commutativity
 * Mathematical rules for force transformations
 */

import type {
  ReciprocalInvariant,
  CommutativityTransform,
  QuadOctaForce,
} from '../types/index.js'

/**
 * Create reciprocal invariant with default tolerance
 */
export function createReciprocalInvariant(
  tolerance: number = 0.01,
): ReciprocalInvariant {
  return {
    upscale: (value: number) => value * 2,
    downscale: (value: number) => value / 2,
    invariantCheck: function (value: number): boolean {
      const upscaled = this.upscale(value)
      const recovered = this.downscale(upscaled)
      return Math.abs(recovered - value) <= tolerance
    },
    tolerance,
  }
}

/**
 * Custom reciprocal invariant with specific scale factors
 */
export function createCustomReciprocalInvariant(
  upscaleFactor: number,
  tolerance: number = 0.01,
): ReciprocalInvariant {
  return {
    upscale: (value: number) => value * upscaleFactor,
    downscale: (value: number) => value / upscaleFactor,
    invariantCheck: function (value: number): boolean {
      const upscaled = this.upscale(value)
      const recovered = this.downscale(upscaled)
      const ratio = recovered / value
      return Math.abs(ratio - 1) <= tolerance
    },
    tolerance,
  }
}

/**
 * Verify reciprocal invariant: S↑ · S↓ ≈ 1
 */
export function verifyReciprocalInvariant(
  invariant: ReciprocalInvariant,
  testValue: number,
): boolean {
  return invariant.invariantCheck(testValue)
}

/**
 * Create commutativity transform between two forces
 */
export function createCommutativityTransform(
  fromForce: QuadOctaForce,
  toForce: QuadOctaForce,
): CommutativityTransform {
  // Define transform functions based on force pairs
  const transform = getTransformFunction(fromForce, toForce)

  return {
    fromForce,
    toForce,
    transform,
    skew: 0, // Perfect commutativity has 0 skew
    bidirectional: true,
  }
}

/**
 * Get transform function for specific force pairs
 */
function getTransformFunction(
  from: QuadOctaForce,
  to: QuadOctaForce,
): (value: number) => number {
  // Sound ↔ Motion: harmonic transformation
  if (
    (from === 'Sound' && to === 'Motion') ||
    (from === 'Motion' && to === 'Sound')
  ) {
    return (value: number) => value * Math.sin((value * Math.PI) / 180)
  }

  // Light ↔ Code: information density transformation
  if (
    (from === 'Light' && to === 'Code') ||
    (from === 'Code' && to === 'Light')
  ) {
    return (value: number) => Math.log2(value + 1)
  }

  // Energy ↔ Matter: E=mc² inspired transformation
  if (
    (from === 'Energy' && to === 'Matter') ||
    (from === 'Matter' && to === 'Energy')
  ) {
    return (value: number) => value * 299792458 // Speed of light constant
  }

  // Time ↔ Spirit: temporal-spiritual alignment
  if (
    (from === 'Time' && to === 'Spirit') ||
    (from === 'Spirit' && to === 'Time')
  ) {
    return (value: number) => value * 0.618 // Golden ratio
  }

  // Default: identity transformation
  return (value: number) => value
}

/**
 * Apply commutativity transform
 */
export function applyTransform(
  transform: CommutativityTransform,
  value: number,
): number {
  return transform.transform(value)
}

/**
 * Verify commutativity: transform(transform^-1(x)) ≈ x
 */
export function verifyCommutativity(
  transform: CommutativityTransform,
  reverseTransform: CommutativityTransform,
  testValue: number,
  tolerance: number = 0.01,
): boolean {
  const forward = transform.transform(testValue)
  const backward = reverseTransform.transform(forward)

  const error = Math.abs(backward - testValue)
  return error <= tolerance
}

/**
 * Calculate skew in transformation
 */
export function calculateSkew(
  transform: CommutativityTransform,
  reverseTransform: CommutativityTransform,
  testValue: number,
): number {
  const forward = transform.transform(testValue)
  const backward = reverseTransform.transform(forward)

  return Math.abs(backward - testValue) / testValue
}

/**
 * Get all standard commutativity transforms
 */
export function getAllCommutativityTransforms(): CommutativityTransform[] {
  const pairs: [QuadOctaForce, QuadOctaForce][] = [
    ['Sound', 'Motion'],
    ['Light', 'Code'],
    ['Energy', 'Matter'],
    ['Time', 'Spirit'],
  ]

  const transforms: CommutativityTransform[] = []

  for (const [from, to] of pairs) {
    transforms.push(createCommutativityTransform(from, to))
    transforms.push(createCommutativityTransform(to, from))
  }

  return transforms
}

/**
 * Test all reciprocal invariants with a test suite
 */
export function testReciprocalInvariants(
  invariant: ReciprocalInvariant,
  testValues: number[],
): { value: number; passed: boolean }[] {
  return testValues.map((value) => ({
    value,
    passed: verifyReciprocalInvariant(invariant, value),
  }))
}

/**
 * Test all commutativity transforms
 */
export function testCommutativityTransforms(
  testValue: number,
): {
  from: QuadOctaForce
  to: QuadOctaForce
  skew: number
  commutative: boolean
}[] {
  const transforms = getAllCommutativityTransforms()
  const results: {
    from: QuadOctaForce
    to: QuadOctaForce
    skew: number
    commutative: boolean
  }[] = []

  for (let i = 0; i < transforms.length; i += 2) {
    const forward = transforms[i]
    const reverse = transforms[i + 1]

    const skew = calculateSkew(forward, reverse, testValue)
    const commutative = verifyCommutativity(forward, reverse, testValue)

    results.push({
      from: forward.fromForce,
      to: forward.toForce,
      skew,
      commutative,
    })
  }

  return results
}
