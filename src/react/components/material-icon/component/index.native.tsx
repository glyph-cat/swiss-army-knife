import { JSX } from 'react'
import { Animated, DimensionValue } from 'react-native'
import {
  MATERIAL_ICON_DEFAULTS,
  MaterialIconProps,
  MaterialIconVariant,
} from '../schema'

/**
 * @public
 * @deprecated
 */
export function MaterialIcon({
  name,
  color,
  size = MATERIAL_ICON_DEFAULTS.size,
  variant = MATERIAL_ICON_DEFAULTS.variant,
  nativeProps = {},
}: MaterialIconProps): JSX.Element {
  const { style, ...remainingNativeProps } = nativeProps
  return (
    <Animated.Text
      style={{
        ...(color ? { color } : {}),
        flexWrap: 'nowrap',
        fontFamily: getPostScriptFontFamilyName(variant),
        fontSize: size as number,
        fontStyle: 'normal',
        fontWeight: '400',
        height: size as DimensionValue,
        textTransform: 'none',
        width: size as DimensionValue,
        ...style as Record<string, unknown>,
      }}
      {...remainingNativeProps}
    >
      {name}
    </Animated.Text>
  )
}

/* eslint-disable */

/**
 * @public
 * @deprecated
 */
export const loadMaterialIconStyleSheets = () => { }

/**
 * @public
 * @deprecated
*/
export const useMaterialIconStyleSheet = () => { }

/* eslint-enable */

/**
 * @public
 * @deprecated
 */
export function MaterialIconStyleSheet(): JSX.Element {
  return null
}

/**
 * @internal
 */
export function getPostScriptFontFamilyName(
  variant: MaterialIconVariant
): string {
  const __format__ = (n: string): string => `MaterialIcons${n}-Regular`
  switch (variant) {
    case 'outlined':
      return __format__('Outlined')
    case 'rounded':
      return __format__('Round')
    case 'sharp':
      return __format__('Sharp')
    case 'two-tone':
      return __format__('TwoTone')
    default:
      // This covers `variant === 'filled'`
      return __format__('')
  }
}
