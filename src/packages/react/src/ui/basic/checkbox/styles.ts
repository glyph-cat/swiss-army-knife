import {
  addStyles,
  clientOnly,
  InternalToken,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { mounted } from '../_internals/data-mounted'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'
import {
  CHECKBOX_OR_RADIO_ACTIVE_COLOR,
  COLOR_WHITE,
  TOKEN_SIZE,
  TOKEN_TINT,
  TOKEN_TINT_40,
  TOKEN_TINT_STRONGER,
} from '../constants'

export const styles = prefixBasicUIIdentifiers('checkbox', [
  'container',
  'flowRow',
  'flowColumn',
  'checkbox',
  'input',
  'checkmark',
  'busy',
])

const disabledColor = '#80808040' // TODO

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      display: 'grid',
      gap: ThemeToken.spacingM,
      placeItems: 'center',
    }],
    [`.${styles.container}::selection`, {
      backgroundColor: TOKEN_TINT_40,
    }],
    [`.${styles.container}:has(.${styles.input}:enabled)`, {
      cursor: ThemeToken.interactiveEnabledCursor,
    }],
    [`.${styles.container}:has(.${styles.input}:disabled)`, {
      cursor: ThemeToken.interactiveDisabledCursor,
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
      border: `solid ${ThemeToken.inputElementBorderSize} ${InternalToken.inputBorderColor}`,
      cursor: 'inherit',
      height: TOKEN_SIZE,
      outline: 'none',
      width: TOKEN_SIZE,
    }],
    [`.${mounted(styles.input)}`, {
      transition: [
        `background-color ${ThemeToken.interactionAnimationDuration}`,
        `background-image ${ThemeToken.interactionAnimationDuration}`,
        `border-color ${ThemeToken.interactionAnimationDuration}`,
      ].join(','),
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
        TOKEN_TINT_STRONGER,
        TOKEN_TINT_STRONGER,
      ].join(',')})`,
      borderColor: TOKEN_TINT_STRONGER,
    }],
    [[
      `.${styles.input}:enabled:active`,
      `.${styles.input}:enabled:checked:active`,
      `.${styles.input}:enabled:indeterminate:active`,
    ].join(','), {
      backgroundImage: `linear-gradient(${CHECKBOX_OR_RADIO_ACTIVE_COLOR}, ${CHECKBOX_OR_RADIO_ACTIVE_COLOR})`,
    }],
    [`.${styles.checkmark}`, {
      color: COLOR_WHITE,
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
    [`.${styles.busy}`, {
      opacity: 0.5,
      placeSelf: 'center',
      pointerEvents: 'none',
      position: 'absolute',
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
