// #region Imports
import {
  concatClassNames,
  deepRemove,
  deepSet,
  HashFactory,
  hasProperty,
  removeDuplicates,
} from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import {
  createContext,
  createElement,
  CSSProperties,
  HTMLElementType,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useInsertionEffect,
} from 'react'
import { MaterialSymbolName } from './names'
import {
  createFontVariationSettingsProp,
  determineOpticalSize,
  resolveStyleSheet,
} from './utils'
// #endregion Imports

// Last modified: 08/12/2024

// #region State Managers

const VariantRequestTrackingState = new SimpleStateManager<Record<string, MaterialSymbolOptions['variant']>>({})

const VariantRequestTrackingIdGenerator = new HashFactory(6)

type IStyleSheetInjectionState = Partial<Record<MaterialSymbolOptions['variant'], true>>
const StyleSheetInjectionState = new SimpleStateManager<IStyleSheetInjectionState>({})

// #endregion State Managers

// #region Types

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
  variant: 'outlined' | 'rounded' | 'sharp'
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
  renderAs?: HTMLElementType
}

/**
 * @public
 */
export type CustomFontFilePathDictionary = Partial<Record<MaterialSymbolOptions['variant'], string>>

// #endregion Types

// #region Constants

const MaterialSymbolsDefaults: MaterialSymbolOptions = {
  fill: 0,
  weight: 400,
  grade: 0,
  opticalSize: 'auto',
  variant: 'outlined',
  color: 'inherit',
  size: 24,
  renderAs: 'span',
}

// #endregion Constants

// #region Provider

type IMaterialSymbolContext = MaterialSymbolOptions
const MaterialSymbolsContext = createContext<IMaterialSymbolContext>(MaterialSymbolsDefaults)

/**
 * @public
 */
export interface MaterialSymbolsProviderProps extends Partial<MaterialSymbolOptions> {
  children?: ReactNode
}

/**
 * A Provider for the {@link MaterialSymbol} component. The {@link MaterialSymbolOptions}
 * props passed to this Provider will be inherited by all `<MaterialSymbol/>`
 * components that are nested within.
 * @public
 */
export function MaterialSymbolsProvider({
  children,
  ...otherProps
}: MaterialSymbolsProviderProps): JSX.Element {
  const ctx = useContext(MaterialSymbolsContext)
  return (
    <MaterialSymbolsContext.Provider
      value={{ ...ctx, ...otherProps }}>
      {children}
    </MaterialSymbolsContext.Provider>
  )
}

// #endregion Provider

// #region Loader

export interface MaterialSymbolsLoaderProps {
  variants: Array<MaterialSymbolsProviderProps['variant']>
  /**
   * If you are hosting the WOFF2 files, the URLs of each variant can be overwritten here.
   */
  customFontFilePath?: CustomFontFilePathDictionary
}

export function MaterialSymbolsLoader({
  variants,
  customFontFilePath,
}: MaterialSymbolsLoaderProps): JSX.Element {

  // TOFIX: This is very exhaustive
  const serializedVariants = removeDuplicates(variants).join(',')

  useEffect(() => {
    const reparsedVariants = serializedVariants.split(',') as Array<MaterialSymbolsProviderProps['variant']>
    const ids: Array<string> = []
    VariantRequestTrackingState.set((s) => {
      for (const variant of reparsedVariants) {
        const id = VariantRequestTrackingIdGenerator.create()
        ids.push(id)
        s = deepSet(s, [id], variant)
      }
      return s
    })
    return () => {
      VariantRequestTrackingState.set((s) => {
        for (const id of ids) {
          s = deepRemove(s, [id])
          VariantRequestTrackingIdGenerator.untrack(id)
        }
        return s
      })
    }
  }, [serializedVariants])

  useInsertionEffect(() => {
    const reparsedVariants = serializedVariants.split(',') as Array<MaterialSymbolsProviderProps['variant']>
    const variantsAndStyles: Record<string, HTMLStyleElement> = {}
    for (const variant of reparsedVariants) {
      if (hasProperty(StyleSheetInjectionState.get(), variant)) { continue }
      const style = document.createElement('style')
      const asyncCb = async () => {
        StyleSheetInjectionState.set((s) => ({ ...s, [variant]: true }))
        style.textContent = await resolveStyleSheet(variant, customFontFilePath?.[variant])
        document.head.append(style)
        variantsAndStyles[variant] = style
      }; asyncCb()
    }
    return () => {
      for (const variant in variantsAndStyles) {
        const style = variantsAndStyles[variant]
        style.remove()
        StyleSheetInjectionState.set((s) => deepRemove(s, [variant]))
      }
    }
  }, [customFontFilePath, serializedVariants])

  return null

}

// #endregion Loader

// #region Main Component

/**
 * @public
 */
export interface MaterialSymbolProps extends Partial<MaterialSymbolOptions> {
  /**
   * Name of the Material Symbol.
   * @see https://fonts.google.com/icons?selected=Material+Symbols
   */
  name: MaterialSymbolName
  className?: string
  style?: CSSProperties
}

/**
 * A wrapper component for using [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols).
 * @public
 */
export function MaterialSymbol({
  name,
  color,
  size,
  fill: overwriteFill,
  weight: overwriteWeight,
  grade: overwriteGrade,
  opticalSize: overwriteOpticalSize,
  variant,
  className,
  style,
  renderAs,
}: MaterialSymbolProps): JSX.Element {

  const ctx = useContext(MaterialSymbolsContext)
  const effectiveVariant = variant || ctx.variant

  // NOTE: Optical size has to be based on final/effective size since 'auto'
  // is not a valid value, so it has to be calculated on a per-component basis.
  const opticalSize = (() => {
    const effectiveOpticalSize = overwriteOpticalSize ?? ctx.opticalSize
    if (effectiveOpticalSize === 'auto') {
      return determineOpticalSize(size)
    } else {
      return effectiveOpticalSize
    }
  })()

  return createElement(renderAs || ctx.renderAs, {
    className: concatClassNames(
      `material-symbols-${effectiveVariant}`,
      className,
    ),
    style: {
      ...style,
      color: color || ctx?.color,
      fontSize: size ?? ctx?.size,
      ...createFontVariationSettingsProp(
        overwriteFill ?? ctx.fill,
        overwriteWeight ?? ctx.weight,
        overwriteGrade ?? ctx.grade,
        opticalSize,
      ),
    },
  }, name)
}

// #endregion Main Component

// #region Other exports
export * from './names'
// #endregion Other exports
