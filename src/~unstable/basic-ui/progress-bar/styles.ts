import {
  addStyles,
  clientOnly,
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

const [
  KEY_BACKGROUND_SIZE,
  __BACKGROUND_SIZE,
  TOKEN_BACKGROUND_SIZE,
] = createTokens('backgroundSize')

const [
  KEY_REPEATING_LINEAR_GRADIENT,
  __REPEATING_LINEAR_GRADIENT,
  TOKEN_REPEATING_LINEAR_GRADIENT,
] = createTokens('repeatingLinearGradient')

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
      backgroundColor: '#00000040',
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
        '#80808040 calc(100% / 4 * 0)',
        '#80808040 calc(100% / 4 * 1)',
        // TODO: Change #80808020' to #80808000 for light theme
        '#80808020 calc(100% / 4 * 1)',
        '#80808020 calc(100% / 4 * 2)',
        '#80808040 calc(100% / 4 * 2)',
        '#80808040 calc(100% / 4 * 2)',
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
