import { isOdd } from '@glyph-cat/swiss-army-knife'
import { isFunction } from '@glyph-cat/type-checking'
import { ReactNode } from 'react'
import { withFallbackRenderKey } from '../../rendering/fallback-key'
import { normalizePattern } from './internal'

/**
 * @public
 */
export type TextEmphasisDirectNode = Exclude<ReactNode, null | undefined | boolean>

/**
 * @public
 */
export interface TextEmphasisProps {
  /**
   * The text to match against.
   */
  children: string
  /**
   * The pattern to match.
   *
   * 📌 For regular expressions, the pattern must be wrapped in brackets. (Example: `/([aeiou])/`)
   */
  match: string | RegExp
  /**
   * Only effective when `match` prop is a string.
   * @defaultValue `false`
   */
  caseSensitive?: boolean // only applied when pattern is string
  /**
   * This can be a {@link ReactNode|`ReactNode`} or a function that returns a
   * {@link ReactNode|`ReactNode`}, excluding `null` | `undefined` | `boolean` types.
   */
  render: TextEmphasisDirectNode | ((text: string, metadata: SimpleTextEmphasisMetadata) => ReactNode)
  /**
   * This can be a {@link ReactNode|`ReactNode`} or a function that returns a
   * {@link ReactNode|`ReactNode`}.
   *
   * Special conditions:
   * - When `null` or `undefined`, assumes prop is not provided and unmatched text
   *   will be rendered as-is.
   * - When `true`, assumes unmatched text should be rendered as-is.
   * - When `false`, assumes nothing should be rendered.
   */
  renderUnmatched?: ReactNode | ((text: string, metadata: SimpleTextEmphasisMetadata) => ReactNode)
}

/**
 * @public
 */
export interface SimpleTextEmphasisMetadata {
  index: number
}

/**
 * @public
 */
export function TextEmphasis({
  children,
  match: $pattern,
  caseSensitive,
  render,
  renderUnmatched,
}: TextEmphasisProps): ReactNode {
  const pattern = normalizePattern($pattern, caseSensitive)
  const textStack = children.split(pattern)
  return textStack.map((text, index) => {
    if (!text) { return null }
    // Matches are always odd-indexed after splitting.
    if (isOdd(index)) {
      if (isFunction(render)) {
        const renderResult = render(text, { index })
        return withFallbackRenderKey(renderResult, index)
      } else {
        return withFallbackRenderKey(render, index)
      }
    } else {
      if (renderUnmatched || renderUnmatched === false) {
        if (isFunction(renderUnmatched)) {
          const renderResult = renderUnmatched(text, { index })
          return withFallbackRenderKey(renderResult, index)
        } else if (renderUnmatched === true) {
          return text
        } else {
          return withFallbackRenderKey(renderUnmatched, index)
        }
      } else {
        return text
      }
    }
  })
}

// —————————————————————————————————————————————————————————————————————————————

/**
 * @public
 */
export interface MultiPatternTextEmphasisMetadata extends SimpleTextEmphasisMetadata {
  pattern: string | RegExp
  caseSensitive?: boolean
}

/**
 * @public
 */
export interface TextEmphasisMatchSpecification {
  /**
   * The pattern to match.
   *
   * 📌 For regular expressions, the pattern must be wrapped in brackets. (Example: `/([aeiou])/`)
   */
  pattern: string | RegExp
  /**
   * Only effective when `pattern` is a string.
   * @defaultValue `false`
   */
  caseSensitive?: boolean
  /**
   * This can be a {@link ReactNode|`ReactNode`} or a function that returns a
   * {@link ReactNode|`ReactNode`}, excluding `null` | `undefined` | `boolean` types.
   */
  render: TextEmphasisDirectNode | ((text: string, metadata: MultiPatternTextEmphasisMetadata) => ReactNode)
}

export interface MultiPatternTextEmphasisProps {
  /**
   * The text to match against.
   */
  children: string
  /**
   * The list of patterns to match against and how they should be rendered.
   */
  match: Array<TextEmphasisMatchSpecification>
  /**
   * This can be a {@link ReactNode|`ReactNode`} or a function that returns a
   * {@link ReactNode|`ReactNode`}.
   *
   * Special conditions:
   * - When `null` or `undefined`, assumes prop is not provided and unmatched text
   *   will be rendered as-is.
   * - When `true`, assumes unmatched text should be rendered as-is.
   * - When `false`, assumes nothing should be rendered.
   */
  renderUnmatched?: ReactNode | ((text: string, metadata: SimpleTextEmphasisMetadata) => ReactNode)
}

interface MultiPatternTextEmphasisNode {
  text: string
  matchSpec?: TextEmphasisMatchSpecification
}

/**
 * @public
 */
export function MultiPatternTextEmphasis({
  children,
  match,
  renderUnmatched,
}: MultiPatternTextEmphasisProps): ReactNode {

  const nodes = match.reduce((acc, matchSpec) => {
    const pattern = normalizePattern(matchSpec.pattern, matchSpec.caseSensitive)
    for (let nodeIndex = 0; nodeIndex < acc.length; nodeIndex++) {
      const textChunks = acc[nodeIndex].text.split(pattern)
      acc.splice(nodeIndex, 1, ...textChunks.map<MultiPatternTextEmphasisNode>(
        (text, chunkIndex) => ({
          text,
          // Matches are always odd-indexed after splitting.
          ...(isOdd(chunkIndex) ? { matchSpec } : {})
        })
      ))
      // Move nodeIndex forward by however many new nodes that were added
      nodeIndex += textChunks.length - 1
    }
    return acc
  }, [{ text: children }] as Array<MultiPatternTextEmphasisNode>)

  return nodes.map(({ text, matchSpec }, nodeIndex) => {
    if (!text) { return null }
    if (matchSpec) {
      if (isFunction(matchSpec.render)) {
        const renderResult = matchSpec.render(text, { ...matchSpec, index: nodeIndex })
        return withFallbackRenderKey(renderResult, nodeIndex)
      } else {
        return withFallbackRenderKey(matchSpec.render, nodeIndex)
      }
    } else {
      if (renderUnmatched || renderUnmatched === false) {
        if (isFunction(renderUnmatched)) {
          const renderResult = renderUnmatched(text, { index: nodeIndex })
          return withFallbackRenderKey(renderResult, nodeIndex)
        } else if (renderUnmatched === true) {
          return text
        } else {
          return withFallbackRenderKey(renderUnmatched, nodeIndex)
        }
      } else {
        return text
      }
    }
  })

}
