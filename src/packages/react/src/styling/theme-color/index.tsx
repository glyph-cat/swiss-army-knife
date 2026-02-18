import { Property } from 'csstype'
import { ReactNode, useInsertionEffect } from 'react'

/**
 * @public
 */
export interface ThemeColorProps {
  color: Property.Color
}

/**
 * @public
 */
export function ThemeColor(props: ThemeColorProps): ReactNode {
  const { color } = props
  useThemeColor(color)
  return null
}

/**
 * @public
 */
export function useThemeColor(color: ThemeColorProps['color']): void {
  useInsertionEffect(() => {
    const themeColorElement = document.createElement('meta')
    themeColorElement.setAttribute('name', 'theme-color')
    themeColorElement.setAttribute('content', color)
    document.head.append(themeColorElement)
    return () => {
      themeColorElement.remove()
    }
  }, [color])
}
