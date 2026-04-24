import { JSX } from 'react'
import { ThemeProviderProps } from '../abstractions'
import { ThemeContext } from '../constants'

/**
 * @public
 */
export function ThemeProvider({
  children,
  theme,
}: ThemeProviderProps): JSX.Element {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
