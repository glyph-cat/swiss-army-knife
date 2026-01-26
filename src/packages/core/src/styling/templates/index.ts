import { addStyles, PrecedenceLevel, StyleMap } from '@glyph-cat/css-utils'
import { clientOnly } from '../../client-only'

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
      // NOTE: For some reason, if top and left is less than twice the amount of the video size,
      // then the promise returned by `navigator.mediaDevices.getUserMedia` will never resolve
      // perhaps this is a security feature, not a bug...
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
