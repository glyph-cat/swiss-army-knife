import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
} from '@glyph-cat/swiss-army-knife'
import { createTokens } from '../_internals/create-tokens'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import { TOKEN_SIZE, TOKEN_TINT, TOKEN_TINT_40 } from '../constants'
import animation from './index.module.css'

export const styles = prefixBasicUIClassNames('spinner', [
  'container',
  'cap',
  'capWithShadow',
  'trailingCapContainer',
])

const [__MASK_SIZE, TOKEN_MASK_SIZE] = createTokens('maskSize')
export const [__THICKNESS, TOKEN_THICKNESS] = createTokens('thickness')
export const [__ANGLE, TOKEN_ANGLE] = createTokens('angle')

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      [__MASK_SIZE]: `calc((${TOKEN_SIZE} / 2) - ${TOKEN_THICKNESS})`,
      backgroundImage: `conic-gradient(${TOKEN_TINT} ${TOKEN_ANGLE}, ${TOKEN_TINT_40} ${TOKEN_ANGLE})`,
      borderRadius: TOKEN_SIZE,
      height: TOKEN_SIZE,
      maskImage: `radial-gradient(circle, transparent ${TOKEN_MASK_SIZE}, black ${TOKEN_MASK_SIZE})`,
      width: TOKEN_SIZE,
    }],
    [`.${styles.container}[aria-busy="true"]`, {
      animation: '1.5s infinite linear',
      animationName: animation.spinClockwise,
      backgroundImage: `conic-gradient(transparent, ${TOKEN_TINT})`,
    }],
    [`.${styles.cap}`, {
      backgroundColor: TOKEN_TINT,
      borderRadius: TOKEN_THICKNESS,
      height: TOKEN_THICKNESS,
      left: `calc(50% - (${TOKEN_THICKNESS} / 2))`,
      position: 'absolute',
      top: 0,
      width: TOKEN_THICKNESS,
    }],
    [`.${styles.trailingCapContainer}`, {
      height: TOKEN_SIZE,
      transform: `rotateZ(${TOKEN_ANGLE})`,
      width: TOKEN_SIZE,
    }],
    [`.${styles.container}[aria-busy="true"] > .${styles.trailingCapContainer}`, {
      display: 'none',
    }],
    [`.${styles.capWithShadow}`, {
      // KIV
      // boxShadow: '2px 0px 2px 0px #00000080',
      boxShadow: `calc(${TOKEN_THICKNESS} / 7) 0px calc(${TOKEN_THICKNESS} / 7) 0px #00000080`,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
