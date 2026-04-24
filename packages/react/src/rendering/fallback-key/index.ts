import { Key, ReactNode, createElement, isValidElement } from 'react'

/**
 * A safeguard utility that adds a fallback key to a {@link ReactNode|`ReactNode`}
 * if it is of type {@link ReactElement|`ReactElement`} and does not have a key prop.
 * @param node - The node to safeguard.
 * @param fallbackKey - The key to use in case the React Element does not already have any
 * @returns a new {@link ReactElement|`ReactElement`} instance.
 * @example
 * withFallbackRenderKey(<li>{item.name}</li>, index)
 * // produces a new React Element equivalent to:
 * <li key={index}>{item.name}</li>
 * @public
 */
export function withFallbackRenderKey<T extends ReactNode>(
  node: T,
  fallbackKey: Key,
): T {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  if (isValidElement<{}>(node)) {
    const { type, key, props } = node
    return createElement(type, {
      ...props,
      key: key || fallbackKey,
    }) as T
  } else {
    return node
  }
}
