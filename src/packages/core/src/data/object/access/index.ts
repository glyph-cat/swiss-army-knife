/**
 * Gets the nth key of an object.
 * @param object - The source object.
 * @param targetPosition - The target position.
 * @returns The key of the object at the nth position.
 * @public
 */
export function getNthKey<T extends Record<PropertyKey, unknown>>(
  object: T,
  targetPosition: number,
): keyof T {
  let position = 1
  for (const key in object) {
    if (position === targetPosition) {
      return key // Early exit
    }
    position += 1
  }
}

/**
 * Gets the nth value of an object.
 * @param object - The source object.
 * @param targetPosition - The target position.
 * @returns The value of the object at the nth position.
 * @public
 */
export function getNthValue<T extends Record<PropertyKey, unknown>>(
  object: T,
  targetPosition: number,
): T[keyof T] {
  return object[getNthKey(object, targetPosition)]
}

/**
 * Gets the 1st key of an object.
 * @param object - The source object.
 * @returns The key of the object at the 1st position.
 * @public
 */
export function getFirstKey<T extends Record<PropertyKey, unknown>>(object: T): keyof T {
  return getNthKey(object, 1)
}

/**
 * Gets the 1st value of an object.
 * @param object - The source object.
 * @returns The value of the object at the 1st position.
 * @public
 */
export function getFirstValue<T extends Record<PropertyKey, unknown>>(object: T): T[keyof T] {
  return getNthValue(object, 1)
}
