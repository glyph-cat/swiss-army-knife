/* eslint-disable import/no-deprecated */
import { JSX, useEffect } from 'react'
import { removeDuplicates } from '../../../../data/array/remove-duplicates'
import { EMPTY_OBJECT } from '../../../../data/dummies'
import { c } from '../../../../styling'
import { JSFunction } from '../../../../types'
import {
  MATERIAL_ICON_DEFAULTS,
  MaterialIconProps,
  MaterialIconStyleSheetProps,
  MaterialIconVariant,
} from '../schema'

/**
 * A convenience wrapper component around the Material Icon fonts.
 *
 * NOTE: Fonts need to be loaded before the icons can be used.
 *
 * For web, there are a few ways:
 * - With the `loadMaterialIconStyleSheet` method
 * - With the `useMaterialIconStyleSheet` hook
 * - With the `<MaterialIconStyleSheet/>` component
 * - Download the icons and host them yourself (See [docs](https://developers.google.com/fonts/docs/material_icons#setup_method_2_self_hosting))
 *
 * For React Native, please follow the instructions here:
 * https://github.com/glyph-cat/swiss-army-knife/blob/main/src/react/components/material-icon/rn-setup.md
 *
 * @see https://fonts.google.com/icons
 * @example
 * function App(): JSX.Element {
 *   return (
 *     <MaterialIcon
 *       name='emoji_people'
 *       size={64}
 *       color='#888888'
 *     />
 *   )
 * }
 * @availability
 * - ✅ Web
 * - ✅ Android
 * - ✅ iOS
 * - 🟠 macOS
 * - 🟠 Windows
 * @public
 * @deprecated
 */
export function MaterialIcon({
  name,
  color,
  size = MATERIAL_ICON_DEFAULTS.size,
  variant = MATERIAL_ICON_DEFAULTS.variant,
  htmlProps = EMPTY_OBJECT,
}: MaterialIconProps): JSX.Element {
  const { className, style, ...remaingHtmlProps } = htmlProps
  return (
    <span
      className={c(
        getVariantSpecs(variant)[0],
        className,
      )}
      style={{
        ...(color ? { color } : {}),
        fontSize: size,
        ...style,
      }}
      {...remaingHtmlProps}
    >
      {name}
    </span>
  )
}

/**
 * Manually load/unload material icon stylesheet.
 * @param variants - The list of variants that you need in your app.
 * @example
 * import { loadMaterialIconStyleSheets } from '{:PACKAGE_NAME:}'
 * // To load
 * const unloadMaterialIconStyleSheets = loadMaterialIconStyleSheets('round', 'filled')
 * // To unload
 * unloadMaterialIconStyleSheets()
 * @availability
 * - ✅ Web
 * - ❌ Android
 * - ❌ iOS
 * - ❌ macOS
 * - ❌ Windows
 * @public
 * @deprecated
 */
export function loadMaterialIconStyleSheet(
  variants: MaterialIconStyleSheetProps['variants']
): JSFunction {
  const requestUrl = getRequestUrlFromVariants(variants)
  const styleElement = document.createElement('style')
  styleElement.innerHTML = `@import url(${requestUrl})`
  document.head.appendChild(styleElement)
  const unloadMaterialIconStyleSheets = () => {
    styleElement.remove()
  }
  return unloadMaterialIconStyleSheets
}

/**
 * Automatically load/unload material icon stylesheet through a React hook.
 * @param variants - The list of variants that you need in your app.
 * @example
 * import { useMaterialIconStyleSheet } from '{:PACKAGE_NAME:}'
 *
 * function App(): JSX.Element {
 *   useMaterialIconStyleSheet(['outlined', 'filled', 'rounded'])
 *   return '...'
 * }
 * @availability
 * - ✅ Web
 * - ❌ Android
 * - ❌ iOS
 * - ❌ macOS
 * - ❌ Windows
 * @public
 * @deprecated
 */
export function useMaterialIconStyleSheet(
  variants: MaterialIconStyleSheetProps['variants']
): void {
  useEffect(() => {
    const unload = loadMaterialIconStyleSheet(variants)
    return () => { unload() }
  }, [variants])
}

/**
 * @example
 * import { MaterialIcon, MaterialIconStyleSheet } from '{:PACKAGE_NAME:}'
 *
 * function App(): JSX.Element {
 *   return (
 *     <>
 *       <MaterialIconStyleSheet variants={['outlined', 'filled', 'rounded']} />
 *       {'(...other components...)'}
 *     </>
 *   )
 * }
 * @availability
 * - ✅ Web
 * - ❌ Android
 * - ❌ iOS
 * - ❌ macOS
 * - ❌ Windows
 * @public
 * @deprecated
 */
export function MaterialIconStyleSheet({
  variants,
}: MaterialIconStyleSheetProps): JSX.Element {
  useMaterialIconStyleSheet(variants)
  return null
}

/**
 * @internal
 */
export function getRequestUrlFromVariants(
  variants: Array<MaterialIconVariant>
): string {
  const variantStack = removeDuplicates(variants)
  const BASE_URL = 'https://fonts.googleapis.com/icon'
  const paramStack = []
  for (const variant of variantStack) {
    paramStack.push(`family=${getVariantSpecs(variant)[1]}`)
  }
  const requestUrl = `${BASE_URL}?${paramStack.join('&')}`
  return requestUrl
}

// NOTE: Below are URLs that can be imported to CSS
// https://fonts.googleapis.com/icon?family=Material+Icons+Outlined
// https://fonts.googleapis.com/icon?family=Material+Icons+Round
// https://fonts.googleapis.com/icon?family=Material+Icons+Sharp
// https://fonts.googleapis.com/icon?family=Material+Icons+Two+Tone
// https://fonts.googleapis.com/icon?family=Material+Icons (Variant: 'filled')

/**
 * @internal
 */
export function getVariantSpecs(
  variant: MaterialIconVariant
): [className: string, paramName: string] {
  const MATERIAL_ICONS_CLASSNAME = 'material-icons'
  const MATERIAL_ICONS_PARAM = 'Material+Icons'
  switch (variant) {
    case 'outlined':
      return [
        MATERIAL_ICONS_CLASSNAME + '-outlined',
        MATERIAL_ICONS_PARAM + '+Outlined',
      ]
    case 'rounded':
      return [
        MATERIAL_ICONS_CLASSNAME + '-round',
        MATERIAL_ICONS_PARAM + '+Round',
      ]
    case 'sharp':
      return [
        MATERIAL_ICONS_CLASSNAME + '-sharp',
        MATERIAL_ICONS_PARAM + '+Sharp',
      ]
    case 'two-tone':
      return [
        MATERIAL_ICONS_CLASSNAME + '-two-tone',
        MATERIAL_ICONS_PARAM + '+Two+Tone',
      ]
    default:
      // This covers `variant === 'filled'`
      return [
        MATERIAL_ICONS_CLASSNAME,
        MATERIAL_ICONS_PARAM,
      ]
  }
}
