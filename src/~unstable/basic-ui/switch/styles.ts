import { addStyles, clientOnly, PrecedenceLevel, StyleMap, ThemeToken } from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import { TOKEN_SIZE } from '../constants'

export const styles = prefixBasicUIClassNames('switch', {
  container: 'container',
})

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      backgroundColor: '#80808080',
      border: `solid ${ThemeToken.inputElementBorderSize} #808080`,
      borderRadius: TOKEN_SIZE,
      height: TOKEN_SIZE,
      width: `calc(${TOKEN_SIZE} * 2)`,
    }],
    // [`.${styles.layoutV}`, {
    //   gridTemplateRows: '1fr auto',
    //   width: TOKEN_SIZE,
    // }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})

