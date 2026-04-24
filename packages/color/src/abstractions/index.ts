import type { BaseColorJson } from '../base'

/**
 * @public
 */
export type OptionalAlpha<T extends BaseColorJson | [number, number, number, number]> = T extends BaseColorJson ? Omit<T, 'a'> & { a?: number } : [number, number, number, number?]
