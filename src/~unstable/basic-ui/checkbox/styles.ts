import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import { TOKEN_SIZE, TOKEN_TINT, TOKEN_TINT_40, TOKEN_TINT_HOVER } from '../constants'

export const styles = prefixBasicUIClassNames('checkbox', {
  container: 'container',
  flowRow: 'flowRow',
  flowColumn: 'flowColumn',
  checkbox: 'checkbox',
  input: 'input',
  checkmark: 'checkmark',
})

const disabledColor = '#80808040'

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      cursor: 'pointer',
      display: 'grid',
      gap: ThemeToken.spacingM,
      placeItems: 'center',
    }],
    [`.${styles.container}::selection`, {
      backgroundColor: TOKEN_TINT_40,
    }],
    [`.${styles.container}:has(.${styles.input}:disabled)`, {
      cursor: 'not-allowed',
    }],
    [`.${styles.flowRow}`, {
      gridAutoFlow: 'row',
      gridAutoRows: 'max-content',
    }],
    [`.${styles.flowColumn}`, {
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
    }],
    [`.${styles.checkbox}`, {
      borderRadius: ThemeToken.inputElementBorderRadius,
      height: TOKEN_SIZE,
      overflow: 'hidden',
      width: TOKEN_SIZE,
    }],
    [`.${styles.input}`, {
      appearance: 'none',
      borderRadius: ThemeToken.inputElementBorderRadius,
      border: `solid ${ThemeToken.inputElementBorderSize} #808080`,
      cursor: 'inherit',
      height: TOKEN_SIZE,
      width: TOKEN_SIZE,
      outline: 'none',
    }],
    [`.${styles.input}:disabled`, {
      borderColor: disabledColor,
    }],
    [[
      `.${styles.input}:disabled:checked`,
      `.${styles.input}:disabled:indeterminate`,
    ].join(','), {
      backgroundColor: disabledColor,
    }],
    [[
      `.${styles.input}:enabled:checked`,
      `.${styles.input}:enabled:indeterminate`,
    ].join(','), {
      backgroundColor: TOKEN_TINT,
      borderColor: TOKEN_TINT,
    }],
    [`.${styles.input}:enabled:hover`, {
      backgroundImage: `linear-gradient(${[
        TOKEN_TINT_40,
        TOKEN_TINT_40,
      ].join(',')})`,
      borderColor: TOKEN_TINT,
    }],
    [[
      `.${styles.input}:enabled:checked:hover`,
      `.${styles.input}:enabled:indeterminate:hover`,
    ].join(','), {
      backgroundImage: `linear-gradient(${[
        TOKEN_TINT_HOVER,
        TOKEN_TINT_HOVER,
      ].join(',')})`,
      borderColor: TOKEN_TINT_HOVER,
    }],
    [[
      `.${styles.input}:enabled:active`,
      `.${styles.input}:enabled:checked:active`,
      `.${styles.input}:enabled:indeterminate:active`,
    ].join(','), {
      backgroundImage: 'linear-gradient(#00000060, #00000060)',
    }],
    [`.${styles.checkmark}`, {
      color: '#ffffff',
      display: 'none',
      placeSelf: 'center',
      pointerEvents: 'none',
      position: 'absolute',
    }],
    [`.${styles.input}:disabled + .${styles.checkmark}`, {
      color: '#808080',
    }],
    [[
      `.${styles.input}:checked + .${styles.checkmark}`,
      `.${styles.input}:indeterminate + .${styles.checkmark}`,
    ].join(','), {
      display: 'grid',
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
