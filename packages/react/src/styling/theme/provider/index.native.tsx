import { ReactNode } from 'react'
import { ThemeProviderProps } from '../abstractions'
import { ThemeContext } from '../constants'

/**
 * @public
 */
export function ThemeProvider({
  children,
  theme,
}: ThemeProviderProps): ReactNode {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
