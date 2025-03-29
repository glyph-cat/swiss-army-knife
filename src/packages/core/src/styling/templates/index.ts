import { addStyles } from '../add-styles'
import { StyleMap } from '../style-map'

/**
 * @public
 */
export const TemplateStyles = {
  hidden: 'hidden',
  a: 'a',
  // TODO: code
} as const

if (typeof window !== 'undefined') {
  addStyles(new StyleMap([
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
