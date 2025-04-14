import {
  addStyles,
  clientOnly,
  InternalToken,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { createTokens } from '../_internals/create-tokens'
import { prefixBasicUIClassNames } from '../_internals/prefixing'
import { TOKEN_SIZE, TOKEN_TINT, TOKEN_TINT_40, TOKEN_TINT_STRONGER } from '../constants'

export const styles = prefixBasicUIClassNames('switch', [
  'container',
  'button',
  'thumb',
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
      justifyItems: 'start',
      paddingInline: ThemeToken.inputElementBorderSize,
      transition: [
        `background-color ${ThemeToken.interactionAnimationDuration}`,
        `border-color ${ThemeToken.interactionAnimationDuration}`,
      ].join(','),
      width: `calc(${TOKEN_SIZE} + ${TOKEN_THUMB_SIZE})`,
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
    [`.${styles.button}[aria-checked="true"] > .${styles.thumb}`, {
      backgroundColor: '#ffffff',
      marginInlineStart: TOKEN_THUMB_SIZE,
    }],
    [`.${styles.button}:disabled`, {
      backgroundColor: InternalToken.switchDisabledBackground,
      borderColor: disabledColor,
    }],
    [`.${styles.button}:disabled[aria-checked="true"]`, {
      backgroundColor: disabledColor,
    }],
    [`.${styles.thumb}`, {
      backgroundColor: InternalToken.thumbColor,
      borderRadius: TOKEN_SIZE,
      height: TOKEN_THUMB_SIZE,
      marginInlineStart: 0,
      placeItems: 'center',
      width: TOKEN_THUMB_SIZE,
      transition: [
        `margin-inline-start ${ThemeToken.interactionAnimationDuration}`,
        `transform ${ThemeToken.interactionAnimationDuration}`,
        `width ${ThemeToken.interactionAnimationDuration}`
      ].join(',')
    }],
    [`.${styles.button}:enabled:active .${styles.thumb}`, {
      width: `calc(${TOKEN_THUMB_SIZE} + ${InternalToken.switchThumbStretchSize})`,
    }],
    [`.${styles.button}[aria-checked="true"]:enabled:active .${styles.thumb}`, {
      transform: `translateX(calc(-1 * ${InternalToken.switchThumbStretchSize}))`,
      width: `calc(${TOKEN_THUMB_SIZE} + ${InternalToken.switchThumbStretchSize})`,
    }],
    [`.${styles.button}:disabled .${styles.thumb}`, {
      // backgroundColor: '#808080a0',
      // backgroundColor: '#ffffff',
      opacity: 0.5,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})

