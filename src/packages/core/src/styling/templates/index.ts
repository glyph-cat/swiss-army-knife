import { CleanupFunction } from '../../types'
import { addStyles } from '../add-styles'
import { compileStyles } from '../compile-styles'
import { StyleMap } from '../style-map'

/**
 * @public
 */
export const TemplateStyles = {
  hidden: 'hidden',
} as const

/**
 * @public
 */
export function loadTemplateStyles(): CleanupFunction {
  return addStyles(compileStyles(new StyleMap([
    [`.${TemplateStyles.hidden}`, {
      left: 0,
      opacity: 0,
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      zIndex: -9999,
    }],
  ])))
}
