export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && !Object.is(value, null)
}
