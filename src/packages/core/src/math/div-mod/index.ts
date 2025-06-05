/**
 * A data structure that store the quotient and remainder of a division. There
 * are two methods to use this, pick whichever that is more convenient for your
 * use case.
 * @example
 * // Method 1 - Array destructuring
 * const [quotient, remainder] = divModData
 * // Method 2 - Object property
 * divModData.q // is the quotient
 * divModData.r // is the remainder
 * @public
 */
export type DivModStruct = [quotient: number, remainder: number] & {
  /**
   * Quotient.
   */
  q: number
  /**
   * Remainder.
   */
  r: number
}

/**
 * Creates a tuple that containing a quotient and a remainder.
 * @param q - The quotient.
 * @param r - The remainder.
 * @returns A tuple containing the quotient and remainder.
 * @public
 */
export function createDivModData(q: number, r: number): DivModStruct {
  const payload = [q, r] as DivModStruct
  payload['q'] = q
  payload['r'] = r
  return payload
}
