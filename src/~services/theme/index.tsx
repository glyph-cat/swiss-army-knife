import { ColorScheme, devError, strictMerge } from '@glyph-cat/swiss-army-knife'
import { ThemeProvider, useColorScheme } from '@glyph-cat/swiss-army-knife-react'
import { StateManager } from 'cotton-box'
import { useStateValue } from 'cotton-box-react'
import { JSX, ReactNode } from 'react'
import { createStorageKey } from '~utils/app'
import { IThemeState, ThemeId } from './abstractions'
import { THEME_DICTIONARY } from './constants'

const STORAGE_KEY = createStorageKey('theme')

export const ThemeStateValue = {
  AUTO: {
    id: ThemeId.DEFAULT_LIGHT,
    auto: true,
  },
  LIGHT: {
    id: ThemeId.DEFAULT_LIGHT,
    auto: false,
  },
  DARK: {
    id: ThemeId.DEFAULT_DARK,
    auto: false,
  },
} as const

export const ThemeState = new StateManager<IThemeState>({
  id: ThemeId.DEFAULT_DARK,
  auto: false,
}, {
  lifecycle: typeof window === 'undefined' ? {} : {
    init({ commit, commitNoop, defaultState }) {
      try {
        const persistedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
        commit(strictMerge(defaultState, persistedData))
        return // Early exit
      } catch (e) {
        devError(e)
      }
      commitNoop()
    },
    didSet({ state }) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
    didReset() {
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})

export function setAutoTheme(): void {
  ThemeState.set(ThemeStateValue.AUTO)
}

export function setLightTheme(): void {
  ThemeState.set(ThemeStateValue.LIGHT)
}

export function setDarkTheme(): void {
  ThemeState.set(ThemeStateValue.DARK)
}

export interface CustomThemeWrapperProps {
  children?: ReactNode
}

export function CustomThemeProvider({
  children,
}: CustomThemeWrapperProps): JSX.Element {
  const { auto, id } = useStateValue(ThemeState)
  const prefersDarkTheme = useColorScheme() === ColorScheme.dark
  const effectiveThemeId = auto ? (prefersDarkTheme ? ThemeId.DEFAULT_DARK : ThemeId.DEFAULT_LIGHT) : id
  const effectiveTheme = THEME_DICTIONARY[effectiveThemeId] ?? THEME_DICTIONARY[ThemeState.defaultState.id]
  return (
    <ThemeProvider theme={effectiveTheme}>
      {children}
    </ThemeProvider>
  )
}
