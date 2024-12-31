import { Property } from 'csstype'
import { useLayoutEffect } from '../../react/hooks/isomorphic-layout-effect'

/**
 * @public
 */
export interface ThemeColorProps {
  color: Property.Color
}

/**
 * @availability
 * - ✅ Web
 * - ❌ Android
 * - ❌ iOS
 * - ❌ macOS
 * - ❌ Windows
 * @public
 */
export function ThemeColor(props: ThemeColorProps): JSX.Element {
  const { color } = props
  useThemeColor(color)
  return null
}

/**
 * @public
 */
export function useThemeColor(color: ThemeColorProps['color']): void {
  useLayoutEffect(() => {
    const themeColorElement = document.createElement('meta')
    themeColorElement.setAttribute('name', 'theme-color')
    themeColorElement.setAttribute('content', color)
    document.head.append(themeColorElement)
    return () => {
      themeColorElement.remove()
    }
  }, [color])
}
