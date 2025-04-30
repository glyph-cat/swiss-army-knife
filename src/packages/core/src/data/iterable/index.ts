
// TODO: inline docs
// TODO: test

export function getNthKey<T extends Record<PropertyKey, unknown>>(
  object: T,
  targetIndex: number = 0
): keyof T {
  let index = 0
  for (const key in object) {
    if (index === targetIndex) {
      return key // Early exit
    }
    index += 1
  }
}

export function getNthValue<T extends Record<PropertyKey, unknown>>(
  object: T,
  targetIndex: number = 0
): T[keyof T] {
  return object[getNthKey(object, targetIndex)]
}

export function getFirstKey<T extends Record<PropertyKey, unknown>>(object: T): keyof T {
  return getNthKey(object, 0)
}

export function getFirstValue<T extends Record<PropertyKey, unknown>>(object: T): T[keyof T] {
  return getNthValue(object, 0)
}
