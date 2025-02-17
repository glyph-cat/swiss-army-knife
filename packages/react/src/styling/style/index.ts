import { addStyles, createRef, PrecedenceLevel } from '@glyph-cat/swiss-army-knife'
import { JSX, useEffect, useInsertionEffect, useState } from 'react'

export interface StyleProps {
  children?: string | Array<string>
  precedence?: PrecedenceLevel
}

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
