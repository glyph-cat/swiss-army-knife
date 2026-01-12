import { isString } from '@glyph-cat/type-checking'
import { ComponentType, HTMLElementType, JSX } from 'react'

/**
 * @public
 */
export interface TextEmphasisProps {
  /**
   * The source text.
   */
  children: string
  /**
   * List of patterns to match.
   *
   * NOTE: When using regular expressions, it is important to wrap the patterns
   * in brackets otherwise the matched text will not be rendered.
   * > "To do the highlight, we create a regex that takes the highlight text and
   * > put it in parentheses so that they’ll be kept when we split the text with
   * > split."
   * >
   * > Quoted from: https://thewebdev.info/2021/11/13/how-to-highlight-text-using-react
   * @example 'a' // string
   * @example /(a)/i // RegExp
   */
  patterns: Array<string | RegExp>
  /**
   * The component to render for the emphasized text.
   */
  component: ComponentType<TextEmphasisComponentProps> | HTMLElementType
  /**
   * @defaultValue `false`
   */
  caseSensitive?: boolean
}

/**
 * @public
 */
export interface TextEmphasisComponentProps {
  /**
   * The matched portion of text.
   */
  value: string
  /**
   * The pattern that matched this portion of text.
   */
  pattern: string | RegExp
}


/**
 * Highlights parts of text that matches the given array of patterns.
 * @public
 * @example
 * function App(): JSX.Element {
 *   return (
 *     <p style={{ fontSize: 48 }}>
 *       <TextEmphasis patterns={[/(a|e|i)/i, 'o', 'u']} component='u'>
 *         {'The quick brown fox jumped over the fence'}
 *       </TextEmphasis>
 *     </p>
 *   )
 * }
 */
export function TextEmphasis({
  children,
  patterns, // TOFIX: not working with regex
  component: EmphasisComponent,
  caseSensitive,
}: TextEmphasisProps): JSX.Element {
  const textStack = [children]
  const safePatternStack: Array<RegExp> = []
  for (const currentPattern of patterns) {
    if (currentPattern === '') { continue }
    for (let i = 0; i < textStack.length; i++) {
      const currentTextSegment = textStack[i]
      const currentSafePattern: RegExp = isString(currentPattern)
        ? new RegExp(`(${currentPattern})`, caseSensitive ? '' : 'i')
        : currentPattern as RegExp
      safePatternStack.push(currentSafePattern)
      const newlySplitted = currentTextSegment.split(currentSafePattern)
      if (newlySplitted.length > 1) {
        textStack.splice(i, 1, ...newlySplitted)
        // Fast forward the `i` to save time
        i = i - 1 + newlySplitted.length
      }
    }
  }
  const renderStack = []
  for (let i = 0; i < textStack.length; i++) {
    const text = textStack[i]
    let patternThatMatched: string | RegExp
    for (const currentSafePattern of safePatternStack) {
      if (currentSafePattern.test(text)) {
        patternThatMatched = currentSafePattern
        break
      }
    }
    renderStack.push(patternThatMatched
      ? isString(EmphasisComponent)
        ? <EmphasisComponent key={i}>{text}</EmphasisComponent>
        : <EmphasisComponent key={i} value={text} pattern={patternThatMatched} />
      : text
    )
  }
  return <>{renderStack}</>
}
