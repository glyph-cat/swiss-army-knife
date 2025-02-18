import { addStyles, createRef } from '@glyph-cat/swiss-army-knife'
import { JSX, useEffect, useInsertionEffect, useState } from 'react'
import { StyleProps } from './abstractions'

/**
 * @public
 */
export function Style({
  children,
  precedence,
}: StyleProps): JSX.Element {
  const [styleElement, setStyleElement] = useState<HTMLStyleElement>(null)
  useEffect(() => {
    const styleElementRef = createRef<HTMLStyleElement>(null)
    const removeStyles = addStyles('', precedence, styleElementRef)
    setStyleElement(styleElementRef.current)
    return removeStyles
  }, [precedence])
  useInsertionEffect(() => {
    if (!styleElement) { return } // Early exit
    styleElement.textContent = Array.isArray(children) ? children.join('') : children
  }, [children, styleElement])
  return null
}

export * from './abstractions/public'
