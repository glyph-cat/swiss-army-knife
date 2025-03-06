import {
  Casing,
  ExtendedCSSProperties,
  isFunction,
  isNullOrUndefined,
  isObjectNotNull,
  PrecedenceLevel,
  StyleManager,
  StyleMap,
} from '@glyph-cat/swiss-army-knife'
import {
  Children,
  JSX,
  ReactElement,
  useCallback,
  useContext,
  useId,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef
} from 'react'
import { GenericHTMLProps } from '../../../abstractions/public'
import { ThemeProviderProps } from '../abstractions'
import { ThemeContext } from '../constants'

/**
 * @public
 */
export function ThemeProvider({
  children: $children,
  theme,
}: ThemeProviderProps): JSX.Element {

  const isNested = isObjectNotNull(useContext(ThemeContext))
  const className = useId().replace(/[^0-9a-z_-]/g, '')

  const spacingStyles = useMemo(() => {
    const styleObject: ExtendedCSSProperties = {}
    for (const key in theme.spacing) {
      const value = theme.spacing[key]
      const property = `--spacing${key}`
      styleObject[property] = `${value}px`
    }
    return styleObject
  }, [theme.spacing])

  const paletteStyles = useMemo(() => {
    const styleObject: ExtendedCSSProperties = {}
    for (const key in theme.palette) {
      const value = theme.palette[key]
      const property = `--${new Casing(key).toCamelCase()}`
      styleObject[property] = value
    }
    return styleObject
  }, [theme.palette])

  const componentParameters = useMemo(() => {
    const styleObject: ExtendedCSSProperties = {}
    for (const key in theme.componentParameters) {
      const value = theme.componentParameters[key]
      const property = `--${new Casing(key).toCamelCase()}`
      styleObject[property] = value
    }
    return styleObject
  }, [theme.componentParameters])

  const customValues = useMemo(() => {
    const styleObject: ExtendedCSSProperties = {}
    for (const key in theme.customValues) {
      const property = `--${new Casing(key).toCamelCase()}`
      styleObject[property] = theme.customValues[key]
    }
    return styleObject
  }, [theme.customValues])

  useInsertionEffect(() => {
    const styleManager = new StyleManager(new StyleMap([
      [`.${className}`, {
        ...spacingStyles,
        ...paletteStyles,
        ...componentParameters,
        ...customValues,
        colorScheme: theme.colorScheme,
      }],
      [`.${className}::selection`, {
        backgroundColor: theme.palette.tint40,
      }],
    ]), -1 as PrecedenceLevel)
    return () => { styleManager.dispose() }
  }, [className, componentParameters, customValues, paletteStyles, spacingStyles, theme.colorScheme, theme.palette.tint40])

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
      throw new Error(`The <ThemeProvider> expects to have only one children when it is not the outermost provider, but received ${children.length}`)
    }
    const [{ type, props: { ref: refProp, ...props }, key }] = children
    return { type, props, key, ref: refProp }
  }, [$children, isNested])

  const assignRef = useCallback((node: HTMLElement) => {
    const { ref: refProp } = loneChild
    if (isFunction(refProp)) {
      refProp(node)
    } else {
      refProp.current = node
    }
    containerRef.current = node
    return () => {
      if (isFunction(refProp)) {
        refProp(null)
      } else {
        refProp.current = null
      }
      containerRef.current = null
    }
  }, [loneChild])

  if (isNested) {
    const { type: Component, props, key } = loneChild
    return (
      <ThemeContext.Provider value={theme}>
        <Component
          ref={assignRef}
          {...(isNullOrUndefined(key) ? {} : { key })}
          {...props}
        />
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
