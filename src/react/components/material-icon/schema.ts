import { TextProps } from 'react-native'
import { QuickHTMLProps } from '../../../types'
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
   * @defaultValue `'28px'`
   */
  size?: QuickHTMLProps<HTMLSpanElement>['style']['fontSize']
  /**
   * @defaultValue `'filled'`
   */
  variant?: MaterialIconVariant
  /**
   * Props to be passed to the HTML element containing the icon.
   * @availability
   * - ❌ Node
   * - ✅ Web
   * - ❌ Android
   * - ❌ iOS
   * - ❌ macOS
   * - ❌ Windows
   * @defaultValue `{}`
   */
  htmlProps?: QuickHTMLProps<HTMLSpanElement>
  /**
   * Props to be passed to the `<Text/>` component containing the icon.
   * @availability
   * - ❌ Node
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
  variants: Array<MaterialIconVariant>
}
