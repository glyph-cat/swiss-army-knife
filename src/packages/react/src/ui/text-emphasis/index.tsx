import { isString } from '@glyph-cat/type-checking'
import { ReactNode } from 'react'

export interface TextEmphasisProps {
  children: string
  match: string | RegExp
  caseSensitive?: boolean // only applied when pattern is string
  render(text: string, metadata: TextEmphasisMetadata): ReactNode
}

export interface TextEmphasisMetadata {
  index: number
}

export function TextEmphasis({
  children,
  match: $pattern,
  caseSensitive,
  render,
}: TextEmphasisProps): ReactNode {
  const pattern = isString($pattern)
    ? new RegExp(`(${$pattern})`, caseSensitive ? '' : 'i')
    : $pattern
  const textStack = children.split(pattern)
  return textStack.map((text, index) => render(text, { index }))
}

// -----------------------------------------------------------------------------

export interface MultiPatternTextEmphasisMetadata extends TextEmphasisMetadata {
  pattern: string | RegExp
  caseSensitive?: boolean
}

export interface TextEmphasisMatchConfiguration {
  pattern: string | RegExp
  caseSensitive?: boolean
  render(text: string, metadata: MultiPatternTextEmphasisMetadata): ReactNode
}

export interface MultiPatternTextEmphasisProps {
  children: string
  match: Array<TextEmphasisMatchConfiguration>
}

export function MultiPatternTextEmphasis({
  children,
  match,
}: MultiPatternTextEmphasisProps): ReactNode {
  return (
    <></>
  )
}
