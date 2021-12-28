import { DetailedHTMLProps, HTMLAttributes } from 'react'

/**
 * Valid data types that can be used as JavaScript object keys.
 * @public
 */
export type JSObjectKey = number | string | symbol

/**
 * A representation of a generic JavaScript object.
 * @public
 */
export type JSObject = Record<JSObjectKey, unknown>

/**
 * A representation of a generic JavaScript function.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSFunction = (...args: Array<any>) => any

/**
 * A shorthand for `DetailedHTMLProps<HTMLAttributes<T>, T>` where T is the HTML
 * Element.
 * @public
 */
export type QuickHTMLProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>
