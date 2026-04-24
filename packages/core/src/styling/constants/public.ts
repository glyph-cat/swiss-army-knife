/**
 * Commonly used animation timing durations in milliseconds.
 * @deprecated Please use `ThemeToken.duration` or `useThemeContext().duration.…` instead.
 * @public
 */
export const Duration = {
  VERY_SHORT: 50,
  SHORT: 100,
  MEDIUM: 200,
  LONG: 300,
  VERY_LONG: 500,
  EXTRA_LONG: 750,
  /**
   * @deprecated Please use `EXTRA_LONG` instead.
   */
  QUARTER_SECOND: 750,
  ONE_SECOND: 1000,
} as const

/**
 * Spacing presets in pixels.
 * @deprecated Please use `ThemeToken.spacing…` or `useThemeContext().spacing.…` instead.
 * @public
 */
export const Spacing = {
  None: 0,
  XXS: 2,
  XS: 3,
  S: 5,
  M: 10,
  L: 15,
  XL: 20,
  XXL: 40,
  XXXL: 60,
} as const

/**
 * CSS safe area insets.
 * @public
 */
export const SafeAreaInset = {
  TOP: 'env(safe-area-inset-top)',
  LEFT: 'env(safe-area-inset-left)',
  RIGHT: 'env(safe-area-inset-right)',
  BOTTOM: 'env(safe-area-inset-bottom)',
} as const
