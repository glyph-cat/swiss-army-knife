import { Empty } from '@glyph-cat/foundation'
import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'
import {
  CHECKBOX_OR_RADIO_ACTIVE_COLOR,
  TOKEN_SIZE,
  TOKEN_TINT,
  TOKEN_TINT_40,
} from '../constants'

export const styles = prefixBasicUIIdentifiers('radio', [
  'container',
  'flowRow',
  'flowColumn',
  'labelFlowRow',
  'labelFlowColumn',
  'label',
  'input',
])

clientOnly(() => {
  const PLAIN_BORDER_COLOR = '#808080'
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      gap: ThemeToken.spacingS,
    }],
    [`.${styles.container}::selection`, {
      backgroundColor: TOKEN_TINT_40,
    }],
    [`.${styles.flowRow}`, {
      gridAutoFlow: 'row',
      // kiv: this is kept to preserve equal width
      // gridAutoRows: 'max-content',
    }],
    [`.${styles.flowColumn}`, {
      // kiv: this is kept to preserve equal width
      // gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
    }],
    [`.${styles.label}`, {
      cursor: ThemeToken.interactiveEnabledCursor,
      display: 'grid',
      gap: ThemeToken.spacingM,
    }],
    [`.${styles.labelFlowRow}`, {
      gridAutoFlow: 'row',
      gridAutoRows: 'max-content',
      justifyItems: 'center',
    }],
    [`.${styles.labelFlowColumn}`, {
      alignItems: 'center',
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
    }],
    [`.${styles.label}:has(.${styles.input}:disabled)`, {
      cursor: ThemeToken.interactiveDisabledCursor,
      opacity: 0.5,
    }],
    [`.${styles.input}`, {
      appearance: 'none',
      border: `solid ${ThemeToken.inputElementBorderSize} ${PLAIN_BORDER_COLOR}`,
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
      backgroundImage: `linear-gradient(${CHECKBOX_OR_RADIO_ACTIVE_COLOR}, ${CHECKBOX_OR_RADIO_ACTIVE_COLOR})`,
    }],
    [`.${styles.input}:enabled:checked`, {
      borderColor: TOKEN_TINT,
    }],
    [`.${styles.input}:disabled:checked:before`, {
      backgroundColor: PLAIN_BORDER_COLOR,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
