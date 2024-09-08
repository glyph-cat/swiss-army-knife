/* eslint-disable import/no-deprecated */
import { Property } from 'csstype'
import { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react'
import { TextProps } from 'react-native'
import { MaterialIconName } from './icon-name'

/**
 * @public
 * @deprecated
 */
export type MaterialIconVariant = 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone'

/**
 * @public
 * @deprecated
 */
export interface MaterialIconProps {
  /**
   * Name of the icon.
   */
  name: MaterialIconName
  /**
   * Color of the icon. For more advanced usage in React Native such as animating
   * the color or using `PlatformColor`, use the native `style` prop instead and
   * override it there.
   * @defaultValue `undefined`
   */
  color?: Property.Color
  /**
   * Size of the icon (using the 'fontSize' property under the hood).
   * @defaultValue `'28px'`
   */
  size?: CSSProperties['fontSize']
  /**
   * @defaultValue `'filled'`
   */
  variant?: MaterialIconVariant
  /**
   * Props to be passed to the HTML element containing the icon.
   * @availability
   * - ✅ Web
   * - ❌ Android
   * - ❌ iOS
   * - ❌ macOS
   * - ❌ Windows
   * @defaultValue `{}`
   */
  htmlProps?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
  /**
   * Props to be passed to the `<Text/>` component containing the icon.
   * @availability
   * - ❌ Web
   * - ✅ Android
   * - ✅ iOS
   * - ✅ macOS
   * - ✅ Windows
   * @defaultValue `{}`
   */
  nativeProps?: TextProps
}

/**
 * Automatically load/unload material icon stylesheet with this component.
 * @public
 * @deprecated
 */
export interface MaterialIconStyleSheetProps {
  /**
   * The list of variants that you need in your app.
   */
  variants: Array<MaterialIconVariant>
}

/**
 * @public
 * @deprecated
 */
export const MATERIAL_ICON_DEFAULTS: {
  size: number,
  variant: MaterialIconVariant,
} = {
  size: 28, // px
  variant: 'filled',
} // NOTE: Not a type, but included here for simplicity's sake.

export * from './icon-name'
