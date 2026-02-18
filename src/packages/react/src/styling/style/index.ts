import { addStyles } from '@glyph-cat/css-utils'
import { createRef, Nullable } from '@glyph-cat/foundation'
import { ReactNode, useEffect, useInsertionEffect, useState } from 'react'
import { StyleProps } from './abstractions'

/**
 * @public
 */
export function Style({
  children,
  precedence,
}: StyleProps): ReactNode {
  const [styleElement, setStyleElement] = useState<Nullable<HTMLStyleElement>>(null)
  useEffect(() => {
    const styleElementRef = createRef<HTMLStyleElement>(null)
    const removeStyles = addStyles('', precedence, styleElementRef)
    setStyleElement(styleElementRef.current)
    return removeStyles
  }, [precedence])
  useInsertionEffect(() => {
    if (!styleElement || !children) { return } // Early exit
    // eslint-disable-next-line react-hooks/immutability
    styleElement.textContent = Array.isArray(children) ? children.join('') : children
  }, [children, styleElement])
  return null
}

export * from './abstractions/public'
