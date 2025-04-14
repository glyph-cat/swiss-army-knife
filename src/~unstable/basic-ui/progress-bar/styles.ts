import {
  addStyles,
  clientOnly,
  InternalToken,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { createTokens } from '../_internals/create-tokens'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import {
  TOKEN_CONTAINER_BORDER_RADIUS,
  TOKEN_FILL_BORDER_RADIUS,
  TOKEN_SIZE,
  TOKEN_TINT,
} from '../constants'
import animation from './index.module.css'

export const styles = prefixBasicUIClassNames('meter', [
  'layoutH',
  'layoutV',
  'container',
  'fill',
])

const DIVISION_FACTOR = 4

const [__BACKGROUND_SIZE, TOKEN_BACKGROUND_SIZE] = createTokens('backgroundSize')

const [__REPEATING_LINEAR_GRADIENT, TOKEN_REPEATING_LINEAR_GRADIENT] = createTokens('repeatingLinearGradient')

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.layoutH}`, {
      height: TOKEN_SIZE,
    }],
    [`.${styles.layoutV}`, {
      gridTemplateRows: '1fr auto',
      width: TOKEN_SIZE,
    }],
    [`.${styles.container}`, {
      backgroundColor: InternalToken.progressBg,
      border: `solid ${ThemeToken.inputElementBorderSize} ${TOKEN_TINT}`,
      borderRadius: TOKEN_CONTAINER_BORDER_RADIUS,
      overflow: 'hidden',
      padding: ThemeToken.inputElementBorderSize,
    }],
    [`.${styles.fill}`, {
      backgroundColor: TOKEN_TINT,
      borderRadius: TOKEN_FILL_BORDER_RADIUS,
    }],
    [`.${styles.container}[aria-busy="true"]`, {
      [__BACKGROUND_SIZE]: `calc(${TOKEN_SIZE} - 4 * ${ThemeToken.inputElementBorderSize})`,
      [__REPEATING_LINEAR_GRADIENT]: `repeating-linear-gradient(${[
        '135deg',
        `${InternalToken.busyShadeA} calc(100% / ${DIVISION_FACTOR} * 0)`,
        `${InternalToken.busyShadeA} calc(100% / ${DIVISION_FACTOR} * 1)`,
        `${InternalToken.busyShadeB} calc(100% / ${DIVISION_FACTOR} * 1)`,
        `${InternalToken.busyShadeB} calc(100% / ${DIVISION_FACTOR} * 2)`,
        `${InternalToken.busyShadeA} calc(100% / ${DIVISION_FACTOR} * 2)`,
        `${InternalToken.busyShadeA} calc(100% / ${DIVISION_FACTOR} * 2)`,
      ].join(',')})`,
    }],
    [`.${styles.container}[aria-busy="true"] > .${styles.fill}`, {
      animation: '0.3s infinite linear',
      backgroundColor: 'transparent',
      backgroundPosition: '0% 0%',
    }],
    [`.${styles.layoutV}[aria-busy="true"] > .${styles.fill}`, {
      animationName: animation.busyV,
      backgroundSize: `100% ${TOKEN_BACKGROUND_SIZE}`,
      backgroundImage: TOKEN_REPEATING_LINEAR_GRADIENT,
    }],
    [`.${styles.layoutH}[aria-busy="true"] > .${styles.fill}`, {
      animationName: animation.busyH,
      backgroundSize: `${TOKEN_BACKGROUND_SIZE} 100%`,
      backgroundImage: TOKEN_REPEATING_LINEAR_GRADIENT,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
