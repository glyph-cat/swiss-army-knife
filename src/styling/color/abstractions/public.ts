/**
 * @public
 */
export enum ColorFormat {
  /**
   * Lowercase red-green-blue.
   * @example
   * `'rgb(255, 255, 255)'`
   */
  rgb = 'rgb',
  /**
   * Lowercase red-green-blue-alpha.
   * @example
   * `'rgba(255, 255, 255, 1)'`
   */
  rgba = 'rgba',
  /**
   * Uppercase red-green-blue.
   * @example
   * `'RGB(255, 255, 255)'`
   */
  RGB = 'RGB',
  /**
   * Uppercase red-green-blue-alpha.
   * @example
   * `'RGBA(255, 255, 255, 1)'`
   */
  RGBA = 'RGBA',
  /**
   * Lowercase hue-saturation-lightness.
   * @example
   * `'hsl(0, 0%, 100%)'`
   */
  hsl = 'hsl',
  /**
   * Lowercase hue-saturation-lightness-alpha.
   * @example
   * `'hsla(0, 0%, 100%, 1)'`
   * @example
   * `'hsla(0, 0%, 100%, 0.5)'`
   */
  hsla = 'hsla',
  /**
   * Uppercase hue-saturation-lightness
   * @example
   * `'HSL(0, 0%, 100%)'`
   */
  HSL = 'HSL',
  /**
   * Uppercase hue-saturation-lightness-alpha.
   * @example `'HSLA(0, 0%, 100%, 1)'`
   */
  HSLA = 'HSLA',
  /**
   * Short lowercase hex string.
   * @example `'#fff'`
   */
  fff = 'fff',
  /**
   * Short lowercase hex string, including alpha.
   * @example `'#ffff'`
   */
  ffff = 'ffff',
  /**
   * Long lowercase hex string.
   * @example `'#ffffff'`
   */
  ffffff = 'ffffff',
  /**
   * Long lowercase hex string, including alpha.
   * @example `'#ffffffff'`
   */
  ffffffff = 'ffffffff',
  /**
   * Short uppercase hex string.
   * @example `'#FFF'`
   */
  FFF = 'FFF',
  /**
   * Short uppercase hex string, including alpha.
   * @example `'#FFFF'`
   */
  FFFF = 'FFFF',
  /**
   * Long uppercase hex string.
   * @example `'#FFFFFF'`
   */
  FFFFFF = 'FFFFFF',
  /**
   * Long uppercase hex string, including alpha.
   * @example `'#FFFFFFFF'`
   */
  FFFFFFFF = 'FFFFFFFF',
}

/**
 * @public
 */
export type WithAlphaAsOptional<T> = Omit<T, 'alpha'> & { alpha?: number }

/**
 * @public
 */
export interface SerializedRGB {
  red: number
  green: number
  blue: number
  alpha: number
}

/**
 * @public
 */
export interface SerializedHSL {
  hue: number
  saturation: number
  lightness: number
  alpha: number
}

/**
 * @public
 */
export interface SerializedColor {
  red: number
  green: number
  blue: number
  alpha: number
  hue: number
  saturation: number
  lightness: number
  luminance: number
}

/**
 * @public
 */
export type ColorField = keyof SerializedColor

/**
 * @public
 */
export type ColorModifier = (value: number) => number

/**
 * @public
 */
export type MultiColorModifier = (currentValues: SerializedColor) => SerializedRGB | SerializedHSL

/**
 * @public
 */
export interface ContrastingValueSpecifications<T> {
  /**
   * Value to return if color is considered 'light'.
   */
  light: T
  /**
   * Value to return if color is considered 'dark'.
   */
  dark: T
  /**
   * A value between 0 - 255.
   * A color is considered 'dark' once its brightness cross this value.
   * @defaultValue `127`
   */
  threshold?: number
}
