import { createContext } from 'react'
import { MaterialSymbolOptions } from '../abstractions'

export const MaterialSymbolOptionsContext = createContext<MaterialSymbolOptions>({
  fill: 0,
  weight: 400,
  grade: 0,
  opticalSize: 'auto',
  variant: 'outlined',
  color: 'inherit',
  size: 24,
  renderAs: 'span',
})
