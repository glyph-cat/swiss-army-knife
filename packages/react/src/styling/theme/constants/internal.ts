import { Nullable } from '@glyph-cat/foundation'
import { Theme } from '@glyph-cat/swiss-army-knife'
import { createContext } from 'react'

export const ThemeContext = createContext<Nullable<Theme>>(null)
