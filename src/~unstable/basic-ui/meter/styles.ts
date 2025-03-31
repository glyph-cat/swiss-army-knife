import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import {
  TOKEN_CONTAINER_BORDER_RADIUS,
  TOKEN_FILL_BORDER_RADIUS,
  TOKEN_SIZE,
  TOKEN_TINT,
} from '../constants'

export const styles = prefixBasicUIClassNames('meter', {
  layoutH: 'layoutH',
  layoutV: 'layoutV',
  container: 'container',
  fill: 'fill',
})

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
  ]).compile(), PrecedenceLevel.INTERNAL)
})
