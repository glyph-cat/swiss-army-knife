import { CSSPropertiesExtended, PrecedenceLevel, StyleManager, StyleMap } from '@glyph-cat/css-utils'
import { Casing } from '@glyph-cat/swiss-army-knife'
import { isFunction, isNullOrUndefined, isObject } from '@glyph-cat/type-checking'
import {
  Children,
  createElement,
  JSX,
  ReactElement,
  useCallback,
  useContext,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef
} from 'react'
import { __setDisplayName } from '../../../_internals'
import { GenericHTMLProps } from '../../../abstractions/public'
import { useClassName } from '../../../hooks/class-name'
import { ThemeProviderProps } from '../abstractions'
import { ThemeContext } from '../constants'

/**
 * @public
 */
export function ThemeProvider({
  children: $children,
  theme,
}: ThemeProviderProps): JSX.Element {

  const isNested = isObject(useContext(ThemeContext))
  const className = useClassName()

  const {
    palette,
    spacing,
    duration,
    componentParameters: $componentParameters,
    internalValues: $internalValues,
  } = theme

  const paletteStyles = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in palette) {
      const value = palette[key as keyof typeof palette]
      const token = `--${new Casing(key).toCamelCase()}`
      styleObject[token] = value
    }
    return styleObject
  }, [palette])

  const spacingStyles = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in spacing) {
      const value = spacing[key as keyof typeof spacing]
      const token = `--spacing${key}`
      styleObject[token] = `${value}px`
    }
    return styleObject
  }, [spacing])

  const durationStyles = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in duration) {
      const value = duration[key as keyof typeof duration]
      const token = `--duration${new Casing(key).toPascalCase()}`
      styleObject[token] = `${value}ms`
    }
    return styleObject
  }, [duration])

  const componentParameters = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in $componentParameters) {
      const value = $componentParameters[key as keyof typeof $componentParameters]
      const token = `--${new Casing(key).toCamelCase()}`
      styleObject[token] = value
    }
    return styleObject
  }, [$componentParameters])

  const customValues = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in theme.customValues) {
      const token = `--${new Casing(key).toCamelCase()}`
      styleObject[token] = theme.customValues[key]
    }
    return styleObject
  }, [theme.customValues])

  const internalValues = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in $internalValues) {
      const token = `--${new Casing(key).toCamelCase()}`
      styleObject[token] = $internalValues[key as keyof typeof $internalValues]
    }
    return styleObject
  }, [$internalValues])

  useInsertionEffect(() => {
    const styleManager = new StyleManager(new StyleMap([
      [`.${className}`, {
        ...spacingStyles,
        ...paletteStyles,
        ...durationStyles,
        ...componentParameters,
        ...customValues,
        ...internalValues,
        backgroundColor: theme.palette.appBgColor,
        color: theme.palette.appTextColor,
        colorScheme: theme.colorScheme,
      }],
      [`.${className} a, .${className} .a`, {
        color: theme.palette.primaryTextColor,
        cursor: 'pointer',
      }],
      [`.${className} a:hover, .${className} .a:hover`, {
        color: theme.palette.primaryTextColorLighter,
      }],
      [`.${className} a:active, .${className} .a:active`, {
        color: theme.palette.primaryTextColorDarker,
      }],
      [`.${className}::selection`, {
        // Ref: https://www.w3schools.com/howto/howto_css_text_selection.asp
        backgroundColor: theme.palette.primaryColor40,
      }],
    ]), PrecedenceLevel.INTERNAL)
    return () => { styleManager.dispose() }
  }, [className, componentParameters, customValues, durationStyles, internalValues, paletteStyles, spacingStyles, theme.colorScheme, theme.palette.appBgColor, theme.palette.appTextColor, theme.palette.primaryColor40, theme.palette.primaryTextColor, theme.palette.primaryTextColorDarker, theme.palette.primaryTextColorLighter])

  useInsertionEffect(() => {
    if (isNested) { return } // Early exit
    document.body.classList.add(className)
    return () => { document.body.classList.remove(className) }
  }, [className, isNested])

  const containerRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (!isNested || !containerRef.current) { return } // Early exit
    const container = containerRef.current
    container.classList.add(className)
    return () => { container.classList.remove(className) }
  }, [className, isNested])

  const loneChild = useMemo(() => {
    if (!isNested) { return null }
    const children = Children.toArray($children) as Array<ReactElement<GenericHTMLProps>>
    if (children.length !== 1) {
      throw new Error(`The <${ThemeProvider.name}> expects to have only one children when it is not the outermost provider, but received ${children.length}`)
    }
    const [{ type, props: { ref: refProp, ...props }, key }] = children
    return { type, props, key, ref: refProp }
  }, [$children, isNested])

  const assignRef = useCallback((node: HTMLElement) => {
    const { ref: refProp } = loneChild!
    if (isFunction(refProp)) {
      refProp(node)
    } else if (refProp) {
      // eslint-disable-next-line react-hooks/immutability
      refProp.current = node
    }
    containerRef.current = node
    return () => {
      if (isFunction(refProp)) {
        refProp(null)
      } else if (refProp) {
        refProp.current = null
      }
      containerRef.current = null
    }
  }, [loneChild])

  if (isNested) {
    // `createElement` is used below to suppress the following error:
    // A props object containing a "key" prop is being spread into JSX
    const { type: Component, props, key } = loneChild!
    return (
      <ThemeContext.Provider value={theme}>
        {createElement(Component, {
          ref: assignRef,
          ...(isNullOrUndefined(key) ? {} : { key }),
          ...props,
        })}
      </ThemeContext.Provider>
    )
  } else {
    return (
      <ThemeContext.Provider value={theme}>
        {$children}
      </ThemeContext.Provider>
    )
  }

}

__setDisplayName(ThemeProvider)
