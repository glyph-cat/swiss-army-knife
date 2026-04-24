import { DetailedHTMLProps, HTMLAttributes } from 'react'

/**
 * Prefer using `JSX.IntrinsicElements` whenever possible.
 *
 * Example:
 * ```ts
 * interface SomePropDefinition {
 *   someProp: JSX.IntrinsicElements['textarea']
 * }
 * ```
 * @public
 */
export type GenericHTMLProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
