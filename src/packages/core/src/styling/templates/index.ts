import { clientOnly } from '../../client-only'
import { addStyles, PrecedenceLevel } from '../add-styles'
import { StyleMap } from '../style-map'

/**
 * @public
 */
export const TemplateStyles = {
  hidden: 'hidden',
  noScroll: 'noScroll',
  a: 'a',
  // TODO: code
} as const

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${TemplateStyles.hidden}`, {
      left: 0,
      opacity: 0,
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      zIndex: -9999,
    }],
    [`.${TemplateStyles.noScroll}`, {
      overflow: 'hidden',
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
