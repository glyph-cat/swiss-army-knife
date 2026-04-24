import { JSXElementConstructor, ReactElement } from 'react'

/**
 * @public
 */
export type ReactElementArray<
  P = unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
> = ReactElement<P, T> | Array<ReactElement<P, T>>
