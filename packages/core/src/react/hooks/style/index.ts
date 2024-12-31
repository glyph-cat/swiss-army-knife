import { CSSProperties, useId, useInsertionEffect, useMemo } from 'react'
import { isNumber } from '../../../data'

// todo: some of these functions are not exclusive to React, split them out

/**
 * @public
 */
export type PseudoClasses =
  | ':hover'
  | ':active'
  | ':focus'
  | ':focus-within'
  | '::placeholder'
  | ':placeholder-shown'

/**
 * ## Pros
 *  - Ability to inject styles that involves pseudo-classes such as `:hover` and
 *    `:active` directly from JSX.
 *  - No need to rename class names in TS and CSS separately.
 *
 * ## Cons
 *  - Does not support chaining selectors.
 *  - Browser specific property names might not be parsed properly.
 *  - Not all pseudo-classes are supported.
 *  - It will create a new stylesheet for every component mounted even if the
 *    styles are the same. (Imagine this hook being used in a component that will
 *    be rendered in an array).
 *  - Changing values in code will cause the whole page to reload.
 * @public
 */
export function useStyles<Key extends string>(
  styles: Record<Key, CSSProperties | Record<PseudoClasses, CSSProperties>>
): Record<Key, string> {

  const prefix = `st${useId().replace(/:/g, '')}`
  const [classNames, styleContent] = useMemo(() => {
    return getClassNamesAndStyleContent(prefix, styles)
  }, [prefix, styles])

  useInsertionEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = styleContent
    document.head.append(styleElement)
    return () => { styleElement.remove() }
  }, [styleContent])

  return classNames

}

type ClassNamesStyleContentPair<Key extends string> = [
  classNames: Record<Key, string>,
  styleContent: string
]

/**
 * @internal
 */
export function getClassNamesAndStyleContent<Key extends string>(
  prefix: string,
  styles: Record<Key, CSSProperties | Record<PseudoClasses, CSSProperties>>
): ClassNamesStyleContentPair<Key> {
  const classNames = {} as Record<Key, string>
  let styleContent = ''
  for (const className in styles) {
    const value = styles[className]
    // Example of `className`: '.foo'
    const prefixedClassName = `${prefix}_${className}`
    const attributes = []
    let queuedPseudoStyleContent = ''
    for (const attributeOrPseudoName in value) {
      const attributeOrPseudoValue = value[attributeOrPseudoName]
      // Example of `attributeOrPseudoName`: 'background-color' | ':hover'
      if (/^:/.test(attributeOrPseudoName as string)) { // is pseudo property
        // Example of `pseudoAttributeName`: 'background-color'
        const pseudoAttributes = []
        for (const pseudoAttributeName in attributeOrPseudoValue) {
          const pseudoAttributeValue = attributeOrPseudoValue[pseudoAttributeName]
          const parsedAttributeName = mapPropertyNameFromJSToCSS(String(pseudoAttributeName))
          const parsedAttributeValue = parsePixelValue(
            parsedAttributeName,
            pseudoAttributeValue as unknown as number
          )
          pseudoAttributes.push(`${parsedAttributeName}:${parsedAttributeValue}`)
        }
        queuedPseudoStyleContent += `.${prefixedClassName}${attributeOrPseudoName as string}{${pseudoAttributes.join(';')}}`
      } else {
        const parsedAttributeName = mapPropertyNameFromJSToCSS(String(attributeOrPseudoName))
        const parsedAttributeValue = parsePixelValue(
          parsedAttributeName,
          attributeOrPseudoValue as number
        )
        attributes.push(`${parsedAttributeName}:${parsedAttributeValue}`)
      }
    }
    styleContent += `.${prefixedClassName}{${attributes.join(';')}}`
    styleContent += queuedPseudoStyleContent
    classNames[className] = prefixedClassName
  }
  return [classNames, styleContent]
}

/**
 * @see https://www.geeksforgeeks.org/how-to-convert-a-string-into-kebab-case-using-javascript
 */
function mapPropertyNameFromJSToCSS(value: string): string {
  let parsedValue = value.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
  if (parsedValue.match(/^(moz|ms|o(?=-)|webkit)/)) {
    parsedValue = `-${parsedValue}`
  }
  return parsedValue
}

function parsePixelValue(attribKey: string, attribValue: number): string | number {
  if (/(gap|height|margin|padding|radius|width)/i.test(attribKey) && isNumber(attribValue)) {
    return `${attribValue}px`
  } else {
    return attribValue
  }
}
