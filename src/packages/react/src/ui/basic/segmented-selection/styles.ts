import {
  addStyles,
  clientOnly,
  CSSPropertiesExtended,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'
import { TOKEN_OVERRIDE_TINT as TOKEN_TINT } from '../constants'

// NOTE: "OVERRIDE_TINT" is required here because `BasicButton` is used, and
// it would already have been injected with a "TINT".

export const DATA_ADJACENT_ITEM_IS_SELECTED = 'data-adjacent-item-is-selected'
const DATA_ADJACENT_ITEM_IS_SELECTED_TRUE = `${DATA_ADJACENT_ITEM_IS_SELECTED}="${String(true)}"`

export const DATA_SELECTED_ITEM_IS_DISABLED = 'data-selected-item-is-disabled'
const DATA_SELECTED_ITEM_IS_DISABLED_TRUE = `${DATA_SELECTED_ITEM_IS_DISABLED}=${String(true)}`

export const DATA_DISABLED = 'data-disabled'
const DATA_DISABLED_TRUE = `${DATA_DISABLED}=${String(true)}`

export const styles = prefixBasicUIIdentifiers('segmented-selection', [
  'container',
  'separatorContainer',
  'separator',
  'item',
])

clientOnly(() => {
  const DISABLED_COLOR = '#80808080'
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      backgroundColor: ThemeToken.neutralColor,
      border: `solid ${ThemeToken.inputElementBorderSize} ${TOKEN_TINT}`,
      borderRadius: ThemeToken.inputElementBorderRadius,
      gridAutoColumns: 'auto 1fr',
      gridAutoFlow: 'column',
      gridTemplateColumns: '1fr',
      overflow: 'hidden',
    }],
    [`.${styles.container}[${DATA_DISABLED_TRUE}]`, {
      borderColor: DISABLED_COLOR,
      backgroundColor: '#80808040',
    }],
    [`.${styles.separatorContainer}`, {
      alignItems: 'center',
      width: 1,
    }],
    [`.${styles.separator}`, {
      backgroundColor: ThemeToken.separatorColor,
      height: '65%',
      opacity: 1,
      transition: EXPERIMENTAL_equalDurationTransition([
        'height',
        'opacity',
      ], ThemeToken.interactionAnimationDuration),
    }],
    [`.${styles.separatorContainer}[${DATA_ADJACENT_ITEM_IS_SELECTED_TRUE}]`, {
      backgroundColor: TOKEN_TINT,
    }],
    [`.${styles.separatorContainer}[${DATA_ADJACENT_ITEM_IS_SELECTED_TRUE}][${DATA_SELECTED_ITEM_IS_DISABLED_TRUE}]`, {
      backgroundColor: DISABLED_COLOR,
    }],
    [`.${styles.separatorContainer}[${DATA_ADJACENT_ITEM_IS_SELECTED_TRUE}] > .${styles.separator}`, {
      opacity: 0,
      height: '0%',
    }],
    [`.${styles.item}`, {
      backgroundColor: 'transparent',
      borderRadius: 0,
      placeItems: 'center',
    }],
    [`.${styles.item}:disabled`, {
      backgroundColor: 'transparent',
    }],
    [`.${styles.item}[data-selected="${String(true)}"]`, {
      backgroundColor: TOKEN_TINT,
    }],
    [`.${styles.item}:disabled[data-selected="${String(true)}"]`, {
      backgroundColor: DISABLED_COLOR,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})

// KIV: This could be a public API
function EXPERIMENTAL_equalDurationTransition(
  properties: Array<keyof CSSPropertiesExtended>,
  duration: CSSPropertiesExtended['transitionDuration'],
): string {
  return properties.map((property) => `${property} ${duration}`).join(',')
}
