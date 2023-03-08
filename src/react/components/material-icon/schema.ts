import { Property } from 'csstype'
import { TextProps } from 'react-native'
import { ShorthandHTMLProps } from '../../../types'
import { MaterialIconName } from './icon-name'

/**
 * @public
 */
export type MaterialIconVariant = 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone'

/**
 * @public
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
  size?: ShorthandHTMLProps<HTMLSpanElement>['style']['fontSize']
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
  htmlProps?: ShorthandHTMLProps<HTMLSpanElement>
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
 */
export interface MaterialIconStyleSheetProps {
  /**
   * The list of variants that you need in your app.
   */
  variants: Array<MaterialIconVariant>
}

/**
 * @public
 */
export const MATERIAL_ICON_DEFAULTS: {
  size: number,
  variant: MaterialIconVariant,
} = {
  size: 28, // px
  variant: 'filled',
} // NOTE: Not a type, but included here for simplicity's sake.

export * from './icon-name'
