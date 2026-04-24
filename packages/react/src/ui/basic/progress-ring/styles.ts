import { addStyles, PrecedenceLevel, StyleMap } from '@glyph-cat/css-utils'
import { clientOnly } from '@glyph-cat/swiss-army-knife'
import { createTokens } from '../_internals/create-tokens'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'
import { TOKEN_SIZE, TOKEN_TINT, TOKEN_TINT_40 } from '../constants'

export const styles = prefixBasicUIIdentifiers('spinner', [
  'container',
  'cap',
  'capWithShadow',
  'trailingCapContainer',
])

export const animations = prefixBasicUIIdentifiers('spinner', [
  'spinClockwise',
  'spinAntiClockwise',
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
      animationName: animations.spinClockwise,
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
  ]).compile() + [
    `@keyframes ${animations.spinClockwise}{0%{transform:rotateZ(0deg)}100%{transform:rotateZ(360deg)}}`,
    `@keyframes ${animations.spinAntiClockwise}{0%{transform:rotateZ(0deg)}100%{transform:rotateZ(-360deg)}}`,
  ].join(''), PrecedenceLevel.INTERNAL)
})
