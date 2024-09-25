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
   * Decimal values will be rounded to the nearest 2 digits by default but this
   * behavior can be customized using this option.
   * @defaultValue `2`
   */
  truncateDecimals?: number
  /**
   * By default alpha values will be forcefully displayed when it is not `1.0`,
   * even when using short formats, so for example:
   * - `ColorFormat.RGB` automatically becomes `ColorFormat.RGBA`
   * - `ColorFormat.HSL` automatically becomes `ColorFormat.HSLA`
   * - `ColorFormat.FFF` automatically becomes `ColorFormat.FFFF`
   * - `ColorFormat.FFFFFF` automatically becomes `ColorFormat.FFFFFFFF`
   * This is a safety measure to prevent loss of data during serialization.
   * However, when there is valid reason to omit the alpha value, set this option
   * to `true` so that the output strictly follows the intended `ColorFormat`.
   */
  suppressAlphaInShortFormats?: boolean
}

/**
 * @public
 */
export type WithAlphaAsOptional<T> = Omit<T, 'alpha'> & { alpha?: number }

/**
 * @public
 */
export interface SerializedRGB {
  /**
   * The red value represented by an integer between `0` to `255`.
   */
  red: number
  /**
   * The green value represented by an integer between `0` to `255`.
   */
  green: number
  /**
   * The blue value represented by an integer between `0` to `255`.
   */
  blue: number
  /**
   * The alpha value represented by a decimal between `0.0 to` `1.0`.
   */
  alpha: number
}

/**
 * @public
 */
export interface SerializedHSL {
  /**
   * The hue, in degrees, represented by an integer between `0` to `360`.
   */
  hue: number
  /**
   * The saturation, in percentage, represented by an integer between 0 to 100.
   */
  saturation: number
  /**
   * The lightness, in percentage, represented by an integer between 0 to 100.
   */
  lightness: number
  /**
   * The alpha value represented by a decimal between `0.0` to `1.0`.
   */
  alpha: number
}

/**
 * @public
 */
export interface SerializedColor {
  /**
   * The red value represented by an integer between `0` to `255`.
   */
  red: number
  /**
   * The green value represented by an integer between `0` to `255`.
   */
  green: number
  /**
   * The blue value represented by an integer between `0` to `255`.
   */
  blue: number
  /**
   * The alpha value represented by a decimal between `0.0` to `1.0`.
   */
  alpha: number
  /**
   * The hue, in degrees, represented by an integer between `0` to `360`.
   */
  hue: number
  /**
   * The saturation, in percentage, represented by an integer between `0` to `100`.
   */
  saturation: number
  /**
   * The lightness, in percentage, represented by an integer between `0` to `100`.
   */
  lightness: number
  /**
   * The perceived brightness of the color, in percentage, represented by a number
   * between `0` to `100`.
   */
  luminance: number
}

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
   * A value between `0` to `255`.
   * A color is considered 'dark' once its brightness exceeds this value.
   * @defaultValue `127`
   */
  threshold?: number
}

/**
 * @see https://www.w3.org/wiki/CSS/Properties/color/keywords
 * @public
 */
export type CSSColor = 'black' | 'silver' | 'gray' | 'white' | 'maroon' | 'red' | 'purple' | 'fuchsia' | 'green' | 'lime' | 'olive' | 'yellow' | 'navy' | 'blue' | 'teal' | 'aqua' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'black' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'white' | 'whitesmoke' | 'yellow' | 'yellowgreen'
