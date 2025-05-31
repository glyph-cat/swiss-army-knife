import { BasicUISize } from '../abstractions'

export const CHECKBOX_SIZE_PRESETS: Record<BasicUISize, [
  boxSize: number,
  iconSize: number,
  spinnerSize: number,
]> = {
  's': [22, 20, 14],
  'm': [28, 24, 18],
  'l': [32, 26, 22],
} as const
