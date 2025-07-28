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
      // borderTop: 'solid 0.5px #ffffff40',
      // boxShadow: '0px 1px 1px 0.5px #00000080',
      color: TOKEN_FG_COLOR,
    }],
    // [`.${styles.button}:enabled::after`, {
    //   content: Empty.DOUBLE_QUOTE,
    //   // backgroundImage: 'linear-gradient(#ffffff08,#00000004,#ffffff04)',
    //   backgroundImage: 'none',
    //   borderRadius: 'inherit',
    //   position: 'absolute',
    //   height: '100%',
    //   width: '100%',
    //   zIndex: 1,
    // }],
    [`.${styles.button}:enabled:hover`, {
      backgroundImage: 'linear-gradient(#ffffff20,#ffffff20)',
    }],
    [[
      `.${styles.button}:enabled:active`,
      `.${styles.button}:enabled[aria-pressed="true"]`,
    ].join(','), {
      backgroundImage: 'linear-gradient(#00000040,#00000040)',
      // borderTopColor: '#ffffff20',
    }],
    // [[
    //   `.${styles.button}:enabled:active::after`,
    //   `.${styles.button}:enabled[aria-pressed="true"]::after`,
    // ].join(','), {
    //   backgroundImage: 'linear-gradient(#00000008,#ffffff04)',
    // }],
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
