import {
  addStyles,
  clientOnly,
  InternalToken,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { createTokens } from '../_internals/create-tokens'
import { mounted } from '../_internals/data-mounted'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'
import { COLOR_WHITE, TOKEN_SIZE, TOKEN_TINT, TOKEN_TINT_40, TOKEN_TINT_STRONGER } from '../constants'

export const styles = prefixBasicUIIdentifiers('switch', [
  'container',
  'button',
  'buttonContainer',
  'thumbBase',
  'thumbUnchecked',
  'thumbChecked',
])

const [__THUMB_SIZE, TOKEN_THUMB_SIZE] = createTokens('thumbSize')

const disabledColor = '#80808040'

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      [__THUMB_SIZE]: `calc(${TOKEN_SIZE} - (${ThemeToken.inputElementBorderSize} * 4))`,
      display: 'grid',
      gap: ThemeToken.spacingM,
      gridAutoFlow: 'column',
      placeItems: 'center',
    }],
    [`.${styles.container}::selection`, {
      backgroundColor: TOKEN_TINT_40,
    }],
    [`.${styles.container}:has(.${styles.button}:enabled)`, {
      cursor: ThemeToken.interactiveEnabledCursor,
    }],
    [`.${styles.container}:has(.${styles.button}:disabled)`, {
      cursor: ThemeToken.interactiveDisabledCursor,
    }],
    [`.${styles.button}`, {
      backgroundColor: InternalToken.switchBackground,
      border: `solid ${ThemeToken.inputElementBorderSize} ${InternalToken.switchBorderColor}`,
      borderRadius: TOKEN_SIZE,
      height: TOKEN_SIZE,
      width: `calc(${TOKEN_SIZE} + ${TOKEN_THUMB_SIZE})`,
    }],
    [`.${mounted(styles.button)}`, {
      transition: [
        `background-color ${ThemeToken.interactionAnimationDuration}`,
        `border-color ${ThemeToken.interactionAnimationDuration}`,
      ].join(','),
    }],
    [`.${styles.buttonContainer}`, {
      height: `calc(${TOKEN_SIZE} - 2 * ${ThemeToken.inputElementBorderSize})`,
      justifyItems: 'start',
      marginInline: ThemeToken.inputElementBorderSize,
      placeItems: 'center',
      width: `calc(${TOKEN_SIZE} + ${TOKEN_THUMB_SIZE} - 4 * ${ThemeToken.inputElementBorderSize})`,
    }],
    [`.${styles.button}:enabled:hover`, {
      backgroundColor: TOKEN_TINT_40,
      borderColor: TOKEN_TINT_STRONGER,
    }],
    [`.${styles.button}[aria-checked="true"]`, {
      backgroundColor: TOKEN_TINT,
      borderColor: TOKEN_TINT,
    }],
    [`.${styles.button}:enabled:hover[aria-checked="true"]`, {
      backgroundColor: TOKEN_TINT,
      borderColor: TOKEN_TINT_STRONGER,
    }],
    [`.${styles.button}:disabled`, {
      backgroundColor: InternalToken.switchDisabledBackground,
      borderColor: disabledColor,
    }],
    [`.${styles.button}:disabled[aria-checked="true"]`, {
      backgroundColor: disabledColor,
    }],
    [`.${styles.thumbBase}`, {
      backgroundColor: InternalToken.thumbColor,
      borderRadius: TOKEN_SIZE,
      height: TOKEN_THUMB_SIZE,
      placeItems: 'center',
      position: 'absolute',
      width: TOKEN_THUMB_SIZE,
    }],
    [`.${mounted(styles.button)} > .${styles.buttonContainer} > .${styles.thumbBase}`, {
      transition: [
        `margin-inline-start ${ThemeToken.interactionAnimationDuration}`,
        `margin-inline-end ${ThemeToken.interactionAnimationDuration}`,
        // TODO: More accurate "equal power cross fade"
        // we need to do this based on whether the thumb is checked or not
        // it cannot be defined once and for all, separation required, example:
        // - thumb checked (ease out) x thumb unchecked (ease in)
        // - thumb unchecked (ease out) x thumb checked (ease in)
        `opacity ${ThemeToken.interactionAnimationDuration} cubic-bezier(0.65, 0, 0.35, 1)`,
        `width ${ThemeToken.interactionAnimationDuration}`,
      ].join(','),
    }],
    [`.${styles.thumbUnchecked}`, {
      marginInlineStart: 0,
      justifySelf: 'start',
      opacity: 1,
    }],
    [`.${styles.thumbChecked}`, {
      backgroundColor: COLOR_WHITE,
      justifySelf: 'end',
      marginInlineEnd: TOKEN_THUMB_SIZE,
      opacity: 0,
    }],
    [`.${styles.button}[aria-checked="true"] > .${styles.buttonContainer} > .${styles.thumbUnchecked}`, {
      opacity: 0,
      marginInlineStart: TOKEN_THUMB_SIZE,
    }],
    [`.${styles.button}[aria-checked="true"] > .${styles.buttonContainer} > .${styles.thumbChecked}`, {
      marginInlineEnd: 0,
      opacity: 1,
    }],
    [`.${styles.button}:enabled:active .${styles.thumbBase}`, {
      width: `calc(${TOKEN_THUMB_SIZE} + ${InternalToken.switchThumbStretchSize})`,
    }],
    [`.${styles.button}:disabled > .${styles.buttonContainer} > .${styles.thumbBase}`, {
      opacity: 0.25,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
