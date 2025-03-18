import { ColorScheme, Theme } from '@glyph-cat/swiss-army-knife'
import { ThemeId } from './abstractions'

export const THEME_DICTIONARY = {
  [ThemeId.DEFAULT_LIGHT]: new Theme(ColorScheme.light),
  [ThemeId.DEFAULT_DARK]: new Theme(ColorScheme.dark),
}

// {
//   primaryColor: '#2b80ff',
//   // primaryColor: '#ffff80',
//   appBgColor: '#111111',
//   appTextColor: '#b5b5b5',
//   separatorColor: '#808080',
//   neutralColor: '#4b6680',
//   infoColor: '#00cccc',
//   successColor: '#00aa00',
//   warnColor: '#ff8000',
//   errorColor: '#ff3333',
//   dangerColor: '#ff4a4a',
// }
