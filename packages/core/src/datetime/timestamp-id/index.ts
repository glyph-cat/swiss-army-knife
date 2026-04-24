/**
 * @public
 */
export function TimestampId(): string {
  return new Date().toISOString().replace(/[^a-z0-9]/gi, '')
}
