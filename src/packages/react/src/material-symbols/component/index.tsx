import { c, CSSProperties, isNumber } from '@glyph-cat/swiss-army-knife'
import { createElement, JSX, useContext } from 'react'
import { __assignDisplayName } from '../../_internals'
import { MaterialSymbolOptions } from '../abstractions'
import { MATERIAL_SYMBOL_BASE_CLASSNAME } from '../constants'
import { MaterialSymbolName } from '../names'
import { MaterialSymbolOptionsContext } from '../provider/internal'

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

  const ctx = useContext(MaterialSymbolOptionsContext)
  const effectiveVariant = variant || ctx.variant
  const effectiveSize = size ?? ctx?.size

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
    className: c(
      `material-symbols-${effectiveVariant}`,
      MATERIAL_SYMBOL_BASE_CLASSNAME,
      className,
    ),
    style: {
      ...style,
      color: color || ctx?.color,
      fontSize: effectiveSize,
      // Width and overflow is set in case font cannot load in time
      overflow: 'hidden',
      width: effectiveSize,
      ...createFontVariationSettingsProp(
        overwriteFill ?? ctx.fill,
        overwriteWeight ?? ctx.weight,
        overwriteGrade ?? ctx.grade,
        opticalSize,
      ),
    },
  }, name)
}

__assignDisplayName(MaterialSymbol)

function createFontVariationSettings(
  fill: MaterialSymbolOptions['fill'],
  weight: MaterialSymbolOptions['weight'],
  grade: MaterialSymbolOptions['grade'],
  opticalSize: MaterialSymbolOptions['opticalSize'],
): Array<string> {
  const list: Array<string> = []
  if (fill) { list.push('"FILL"' + (isNumber(fill) ? fill : (fill ? 1 : 0))) }
  if (weight) { list.push('"wght"' + weight) }
  if (isNumber(grade)) { list.push('"GRAD"' + grade) }
  if (opticalSize) { list.push('"opsz"' + opticalSize) }
  return list
}

function createFontVariationSettingsProp(
  fill: MaterialSymbolOptions['fill'],
  weight: MaterialSymbolOptions['weight'],
  grade: MaterialSymbolOptions['grade'],
  opticalSize: MaterialSymbolOptions['opticalSize'],
): Partial<Pick<CSSProperties, 'fontVariationSettings'>> {
  const list = createFontVariationSettings(fill, weight, grade, opticalSize)
  return list.length > 0 ? { fontVariationSettings: list.join(',') } : {}
}

function determineOpticalSize(size: number): Exclude<MaterialSymbolOptions['opticalSize'], 'auto'> {
  if (size >= 48) {
    return 48
  } else if (size >= 40) {
    return 40
  } else if (size >= 24) {
    return 24
  } else {
    return 20
  }
}
