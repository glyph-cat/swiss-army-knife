import { DetailedHTMLProps, HTMLAttributes, JSX } from 'react'

/**
 * @public
 */
export type GenericHTMLProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

/**
 * @public
 */
export type JSXPayload = JSX.Element | null | false
