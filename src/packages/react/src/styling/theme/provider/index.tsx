import {
  Casing,
  CSSPropertiesExtended,
  isFunction,
  isNullOrUndefined,
  isObject,
  PrecedenceLevel,
  StyleManager,
  StyleMap,
} from '@glyph-cat/swiss-army-knife'
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

  const paletteStyles = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in theme.palette) {
      const value = theme.palette[key]
      const token = `--${new Casing(key).toCamelCase()}`
      styleObject[token] = value
    }
    return styleObject
  }, [theme.palette])

  const spacingStyles = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in theme.spacing) {
      const value = theme.spacing[key]
      const token = `--spacing${key}`
      styleObject[token] = `${value}px`
    }
    return styleObject
  }, [theme.spacing])

  const durationStyles = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in theme.duration) {
      const value = theme.duration[key]
      const token = `--duration${new Casing(key).toPascalCase()}`
      styleObject[token] = `${value}ms`
    }
    return styleObject
  }, [theme.duration])

  const componentParameters = useMemo(() => {
    const styleObject: CSSPropertiesExtended = {}
    for (const key in theme.componentParameters) {
      const value = theme.componentParameters[key]
      const token = `--${new Casing(key).toCamelCase()}`
      styleObject[token] = value
    }
    return styleObject
  }, [theme.componentParameters])

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
    for (const key in theme.internalValues) {
      const token = `--${new Casing(key).toCamelCase()}`
      styleObject[token] = theme.internalValues[key]
    }
    return styleObject
  }, [theme.internalValues])

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
    if (!isNested) { return } // Early exit
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
    const { ref: refProp } = loneChild
    if (isFunction(refProp)) {
      refProp(node)
    } else if (refProp) {
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
    const { type: Component, props, key } = loneChild
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
