import { CleanupFunction } from '../../types'
import { addStyles } from '../add-styles'
import { StyleMap } from '../style-map'

/**
 * @public
 */
export const TemplateStyles = {
  hidden: 'hidden',
  a: 'a',
} as const

/**
 * @public
 */
export function loadTemplateStyles(): CleanupFunction {
  return addStyles(new StyleMap([
    [`.${TemplateStyles.hidden}`, {
      left: 0,
      opacity: 0,
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      zIndex: -9999,
    }],
  ]).compile())
}
