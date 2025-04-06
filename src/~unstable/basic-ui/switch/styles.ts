import { addStyles, clientOnly, PrecedenceLevel, StyleMap, ThemeToken } from '@glyph-cat/swiss-army-knife'
import { createTokens } from '../_internals/create-tokens'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import { TOKEN_SIZE, TOKEN_TINT, TOKEN_TINT_40 } from '../constants'

export const styles = prefixBasicUIClassNames('switch', [
  'container',
  'button',
  'thumb',
])

const [
  KEY_THUMB_SIZE,
  __THUMB_SIZE,
  TOKEN_THUMB_SIZE,
] = createTokens('thumbSize')

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      [__THUMB_SIZE]: `calc(${TOKEN_SIZE} - (${ThemeToken.inputElementBorderSize} * 4))`,
    }],
    [`.${styles.button}`, {
      border: `solid ${ThemeToken.inputElementBorderSize} #808080`,
      borderRadius: TOKEN_SIZE,
      height: TOKEN_SIZE,
      justifyItems: 'start',
      paddingInline: ThemeToken.inputElementBorderSize,
      width: `calc(${TOKEN_SIZE} + ${TOKEN_THUMB_SIZE})`,
    }],
    [`.${styles.thumb}`, {
      backgroundColor: '#eeeeee',
      // backgroundColor: TOKEN_TINT, // for light theme
      borderRadius: TOKEN_SIZE,
      height: TOKEN_THUMB_SIZE,
      width: TOKEN_THUMB_SIZE,
      marginInlineStart: 0,
    }],
    [`.${styles.button}[aria-checked="true"]`, {
      backgroundColor: TOKEN_TINT,
      borderColor: TOKEN_TINT,
    }],
    [`.${styles.button}[aria-checked="true"] > .${styles.thumb}`, {
      backgroundColor: '#ffffff',
      marginInlineStart: TOKEN_THUMB_SIZE,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})

