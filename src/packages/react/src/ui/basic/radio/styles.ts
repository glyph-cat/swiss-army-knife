import {
  addStyles,
  clientOnly,
  Empty,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'
import { TOKEN_SIZE, TOKEN_TINT, TOKEN_TINT_40 } from '../constants'

export const styles = prefixBasicUIIdentifiers('radio', [
  'container',
  'flowRow',
  'flowColumn',
  'label',
  'input',
])

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      gridAutoRows: 'max-content',
      gap: ThemeToken.spacingS,
    }],
    [`.${styles.container}::selection`, {
      backgroundColor: TOKEN_TINT_40,
    }],
    [`.${styles.flowRow}`, {
      gridAutoFlow: 'row',
      gridAutoRows: 'max-content',
    }],
    [`.${styles.flowColumn}`, {
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
    }],
    [`.${styles.label}`, {
      alignItems: 'center',
      cursor: ThemeToken.interactiveEnabledCursor,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: ThemeToken.spacingM,
      justifySelf: 'start',
    }],
    [`.${styles.label}:has(.${styles.input}:disabled)`, {
      cursor: ThemeToken.interactiveDisabledCursor,
      opacity: 0.5,
    }],
    [`.${styles.input}`, {
      appearance: 'none',
      border: `solid ${ThemeToken.inputElementBorderSize} #808080`, // todo: color?
      borderRadius: TOKEN_SIZE,
      cursor: 'inherit',
      display: 'grid',
      overflow: 'hidden',
      height: TOKEN_SIZE,
      margin: 0,
      width: TOKEN_SIZE,
    }],
    [`.${styles.input}:before`, {
      content: Empty.DOUBLE_QUOTE,
      transform: 'scale(0.55)',
      transition: `transform ${ThemeToken.interactionAnimationDuration}`,
    }],
    [`.${styles.input}:checked:before`, {
      backgroundColor: TOKEN_TINT,
      borderRadius: '50%',
      transform: 'scale(0.75)',
    }],
    [`.${styles.input}:enabled:hover`, {
      backgroundImage: `linear-gradient(${TOKEN_TINT_40},${TOKEN_TINT_40})`,
      borderColor: TOKEN_TINT,
    }],
    [`.${styles.input}:enabled:active`, {
      backgroundImage: 'linear-gradient(#00000060, #00000060)', // todo
    }],
    [`.${styles.input}:enabled:checked`, {
      borderColor: TOKEN_TINT,
    }],
    [`.${styles.input}:disabled`, {
      '--disabledColor': '#80808040', // todo
      borderColor: 'var(--disabledColor)', // todo
      opacity: 0.5,
    }],
    [`.${styles.input}:disabled`, {
      backgroundColor: 'var(--disabledColor)',
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
