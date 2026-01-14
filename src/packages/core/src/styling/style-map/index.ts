import { CSSPropertiesExtended } from '@glyph-cat/css-utils'
import { compileStyle } from '../compile-styles'

/**
 * @public
 */
export class StyleMap extends Map<string, CSSPropertiesExtended> {

  /**
   * Uses {@link compileStyle} to compile a complete CSS syntax string from a
   * [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
   * where each key-value pair is the CSS class/selector and the style object.
   * @example
   * const styleMap = new StyleMap([
   *   ['.foo', {
   *     backgroundColor: '#ffffff',
   *   }],
   *   ['.bar', {
   *     backgroundColor: '#ff0000',
   *   }],
   * ])
   *
   * styleMap.compile()
   * // Output: '.foo{background-color:#ffffff}.bar{background-color:#ff0000}'
   */
  compile(): string {
    const compiledStyles: Array<string> = []
    this.forEach((value, key) => {
      compiledStyles.push(compileStyle(key, value))
    })
    return compiledStyles.join('')
  }

}

// NOTE: This reason method is named `compile` instead of `toString` is to
// prevent accidentally serializing the map when it contains a large list of styles.
// This can happen, for example, during error reporting in other APIs that
// would try to log the value of a invalid parameter and it happens so that
// a StyleMap is mistakenly passed as that parameter.
