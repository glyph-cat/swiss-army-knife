import { CSSProperties } from '@glyph-cat/css-utils'

/**
 * @public
 */
export type MaterialSymbolVariant = 'outlined' | 'rounded' | 'sharp'

/**
 * @public
 */
export interface MaterialSymbolOptions {
  /**
   * Fill gives you the ability to modify the default icon style.
   * A single icon can render both unfilled and filled states.
   *
   * To convey a state transition, use the fill axis for animation or interaction.
   * The values are 0 for default or 1 for completely filled.
   * Along with the weight axis, the fill also impacts the look of the icon.
   * @see https://m3.material.io/styles/icons/applying-icons#ebb3ae7d-d274-4a25-9356-436e82084f1f
   *
   * Alternative shorthands:
   * - `false` = `0`
   * - `true` = `1`
   *
   * @defaultValue `0`
   */
  fill: boolean | number
  /**
   * Weight defines the symbol's stroke weight, with a range of weights between
   * thin (100) and bold (700). Weight can also affect the overall size of the symbol.
   * @see https://m3.material.io/styles/icons/applying-icons#d7f45762-67ac-473d-95b0-9214c791e242
   * @defaultValue `400`
   */
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700
  /**
   * Weight and grade affect a symbol's thickness. Adjustments to grade are
   * more granular than adjustments to weight and have a small impact on
   * the size of the symbol.
   *
   * Grade is also available in some text fonts. You can match grade levels between
   * text and symbols for a harmonious visual effect. For example, if the text font
   * has a -25 grade value, the symbols can match it with a suitable value, say -25.
   *
   * You can use grade for different needs:
   * - Low emphasis (e.g. -25 grade): To reduce glare for a light symbol on a dark background, use a low grade.
   * - High emphasis (e.g. 200 grade): To highlight a symbol, increase the positive grade.
   *
   * @see https://m3.material.io/styles/icons/applying-icons#3ad55207-1cb0-43af-8092-fad2762f69f7
   * @defaultValue `0`
   */
  grade: -25 | 0 | 200
  /**
   * Optical Sizes range from 20dp to 48dp.
   *
   * For the image to look the same at different sizes, the stroke weight (thickness)
   * changes as the icon size scales. Optical Size offers a way to automatically
   * adjust the stroke weight when you increase or decrease the symbol size.
   *
   * @see https://m3.material.io/styles/icons/applying-icons#b41cbc01-9b49-4a44-a525-d153d1ea1425
   * @defaultValue `24`
   */
  opticalSize: 'auto' | 20 | 24 | 40 | 48
  /**
   * Rounded symbols use a corner radius that pairs well with brands that use
   * heavier typography, curved logos, or circular elements to express their style.
   *
   * Sharp symbols display corners with straight edges, for a crisp style that
   * remains legible even at smaller scales. These rectangular shapes can support
   * brand styles that aren't well-reflected by rounded shapes.
   *
   * @see https://m3.material.io/styles/icons/applying-icons#67978061-677b-4dfc-a632-dbc497ae0f3e
   * @defaultValue `'outlined'`
   */
  variant: MaterialSymbolVariant
  /**
   * Color of the icon.
   * @defaultValue `'inherit'`
   */
  color: CSSProperties['color']
  /**
   * Size of the icon in pixels.
   * @defaultValue `24`
   */
  size: number
  /**
   * The HTML component which the icon will be rendered in.
   *
   * In React Native, this prop is ignored and the icon will always be rendered
   * in a `Animated.Text` component.
   * @defaultValue `'span'`
   */
  renderAs?: keyof HTMLElementTagNameMap
}
