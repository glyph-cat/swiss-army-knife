import { IS_INTERNAL_DEBUG_ENV } from '../constants'

// TODO: Ban the usage of `Math.random` (perhaps) with ESLint with a message asking to use this wrapper function instead.

/**
 * A wrapper around JavaScript's `Math.random`. In test environment, this
 * generates a predetermined "random number". In normal debug and production
 * environments, `Math.random` will be used. By swapping out `Math.random` with
 * a plain function that always returns the same "random number", this increases
 * predictability and consistency in our tests.
 * @returns A predetermined "random number".
 * @internal
 */
export function TESTSAFE_random(): number {
  return IS_INTERNAL_DEBUG_ENV ? 0.4 : Math.random()
}
