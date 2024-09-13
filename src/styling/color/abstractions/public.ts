/**
 * @public
 */
export enum ColorFormat {
  /**
   * red-green-blue.
   * @example
   * `'RGB(255, 255, 255)'`
   */
  RGB = 'RGB',
  /**
   * red-green-blue-alpha.
   * @example
   * `'RGBA(255, 255, 255, 1)'`
   */
  RGBA = 'RGBA',
  /**
   * hue-saturation-lightness
   * @example
   * `'HSL(0, 0%, 100%)'`
   */
  HSL = 'HSL',
  /**
   * hue-saturation-lightness-alpha.
   * @example `'HSLA(0, 0%, 100%, 1)'`
   */
  HSLA = 'HSLA',
  /**
   * Short hex string.
   * @example `'#FFF'`
   */
  FFF = 'FFF',
  /**
   * Short hex string including alpha.
   * @example `'#FFFF'`
   */
  FFFF = 'FFFF',
  /**
   * Long hex string.
   * @example `'#FFFFFF'`
   */
  FFFFFF = 'FFFFFF',
  /**
   * Long hex string including alpha.
   * @example `'#FFFFFFFF'`
   */
  FFFFFFFF = 'FFFFFFFF',
}

/**
 * @public
 */
export interface ToStringOptions {
  /**
   * @defaultValue `false`
   */
  upperCase?: boolean
  /**
   * @defaultValue `2`
   */
  truncateDecimals?: number
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
export type MultiColorModifier = (
  currentValues: Omit<SerializedColor, 'luminance'>
) => SerializedRGB | SerializedHSL

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

/**
 * @see https://www.w3.org/wiki/CSS/Properties/color/keywords
 * @public
 */
export type CSSColor = 'black' | 'silver' | 'gray' | 'white' | 'maroon' | 'red' | 'purple' | 'fuchsia' | 'green' | 'lime' | 'olive' | 'yellow' | 'navy' | 'blue' | 'teal' | 'aqua' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'black' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'white' | 'whitesmoke' | 'yellow' | 'yellowgreen'
