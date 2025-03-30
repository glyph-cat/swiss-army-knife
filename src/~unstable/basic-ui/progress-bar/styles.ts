import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { createTokens } from '../_internals/create-tokens'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import { TOKEN_SIZE, TOKEN_TINT } from '../constants'

export const styles = prefixBasicUIClassNames('meter', {
  layoutH: 'layoutH',
  layoutV: 'layoutV',
  container: 'container',
  fill: 'fill',
})

export const [
  KEY_CONTAINER_BORDER_RADIUS,
  __CONTAINER_BORDER_RADIUS,
  TOKEN_CONTAINER_BORDER_RADIUS,
] = createTokens('containerBorderRadius')

export const [
  KEY_FILL_BORDER_RADIUS,
  __FILL_BORDER_RADIUS,
  TOKEN_FILL_BORDER_RADIUS,
] = createTokens('fillBorderRadius')

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
    [`.${styles.container}[aria-busy="true"] > .${styles.fill}`, {
      backgroundColor: '#80808020',
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
