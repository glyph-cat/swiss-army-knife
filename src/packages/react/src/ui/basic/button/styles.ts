import {
  addStyles,
  clientOnly,
  InternalToken,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'
import { TOKEN_FG_COLOR, TOKEN_SIZE, TOKEN_TINT } from '../constants'

export const styles = prefixBasicUIIdentifiers('basic-button', [
  'button',
  'contentContainer',
  'busyIndicator',
])

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.button}`, {
      backgroundColor: TOKEN_TINT,
      borderRadius: ThemeToken.inputElementBorderRadius,
      fontSize: '12pt',
      height: TOKEN_SIZE,
      overflow: 'hidden',
      placeItems: 'normal',
    }],
    [`.${styles.button}[data-template="text"]`, {
      minWidth: 150,
      padding: `${ThemeToken.spacingS} ${ThemeToken.spacingM}`,
    }],
    [`.${styles.button}[data-template="icon"]`, {
      width: TOKEN_SIZE,
    }],
    [`.${styles.button}:enabled`, {
      color: TOKEN_FG_COLOR,
    }],
    [`.${styles.button}:enabled:hover`, {
      backgroundImage: 'linear-gradient(#ffffff20,#ffffff20)',
    }],
    [[
      `.${styles.button}:enabled:active`,
      `.${styles.button}:enabled[aria-pressed="true"]`,
    ].join(','), {
      backgroundImage: 'linear-gradient(#00000040,#00000040)',
    }],
    [`.${styles.button}:disabled`, {
      backgroundColor: InternalToken.buttonDisabledColor,
    }],
    [`.${styles.contentContainer}`, {
      placeItems: 'center',
    }],
    [`.${styles.button}:disabled > .${styles.contentContainer}`, {
      opacity: 0.75,
    }],
    [`.${styles.busyIndicator}`, {
      placeSelf: 'center',
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
