import { GlobalCSSClassNameFactory } from '@glyph-cat/swiss-army-knife'
import { useId } from 'react'
import { useConstant } from '../constant'

/**
 * @public
 */
export function useClassName(): string {
  const id = useId()
  const className = useConstant(() => {
    // There is a possibility that the returned value of `useId()` can start
    // with a number, which is invalid for CSS class names. So a 'c' is appended.
    const newValue = `c${id.replace(/[^0-9a-z_-]/g, '')}`
    GlobalCSSClassNameFactory.track(newValue)
    return newValue
  })
  return className
}
