import { useEffect } from 'react'
import { removeDuplicates } from '../../../data/array/remove-duplicates'
import { isUndefined } from '../../../data/type-check'
import { devWarn } from '../../../dev'
import { JSFunction } from '../../../types'
import {
  MaterialIconProps,
  MaterialIconStyleSheetProps,
  MaterialIconVariant,
} from './schema'
import {
  MATERIAL_ICON_DEFAULT_SIZE,
  MATERIAL_ICON_DEFAULT_VARIANT,
} from './__shared__'

/**
 * A convenience component to use Material Icons.
 *
 * You need to load the the Material Icon stylesheet to use this component.
 * For web, there are a few ways:
 * - With the `loadMaterialIconStyleSheet` method
 * - With the `useMaterialIconStyleSheet` hook
 * - With the `<MaterialIconStyleSheet/>` component
 * - Download the icons and host them yourself (See [docs](https://developers.google.com/fonts/docs/material_icons#setup_method_2_self_hosting))
 * @see https://fonts.google.com/icons
 * @availability
 * - ❌ Node
 * - ✅ Web
 * - ✅ Android
 * - ✅ iOS
 * - 🟠 macOS
 * - 🟠 Windows
 * @public
 */
export function MaterialIcon({
  name,
  size = MATERIAL_ICON_DEFAULT_SIZE,
  variant = MATERIAL_ICON_DEFAULT_VARIANT,
  htmlProps = {},
}: MaterialIconProps): JSX.Element {
  const { className = '', style, ...remaingHtmlProps } = htmlProps
  if (!isUndefined(style.fontSize)) {
    devWarn(
      'The `style.fontSize` property is ignored in <MaterialComponent/>. ' +
      'Please use the `size` prop instead.'
    )
  }
  return (
    <span
      className={[
        getVariantSpecs(variant)[0],
        className,
      ].join(' ')}
      style={{
        ...style,
        fontSize: size,
      }}
      {...remaingHtmlProps}
    >
      {name}
    </span>
  )
}

/**
 * Manually load/unload material icon stylesheet.
 * @example
 * // To load
 * const unloadMaterialIconStyleSheets = loadMaterialIconStyleSheets('round', 'filled')
 * // To unload
 * unloadMaterialIconStyleSheets()
 * @availability
 * - ❌ Node
 * - ✅ Web
 * - ❌ Android
 * - ❌ iOS
 * - ❌ macOS
 * - ❌ Windows
 * @public
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
 * @availability
 * - ❌ Node
 * - ✅ Web
 * - ❌ Android
 * - ❌ iOS
 * - ❌ macOS
 * - ❌ Windows
 * @public
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
 * @availability
 * - ❌ Node
 * - ✅ Web
 * - ❌ Android
 * - ❌ iOS
 * - ❌ macOS
 * - ❌ Windows
 * @public
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
  const BASE_URL = 'https://fonts.googleapis.com/icon?'
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
  if (variant === 'outlined') {
    return [
      MATERIAL_ICONS_CLASSNAME + 'outlined',
      MATERIAL_ICONS_PARAM + '+Outlined',
    ]
  } else if (variant === 'rounded') {
    return [
      MATERIAL_ICONS_CLASSNAME + 'round', 'Material+Icons+Round']
  } else if (variant === 'sharp') {
    return [
      MATERIAL_ICONS_CLASSNAME + 'sharp',
      'Material+Icons+Sharp',
    ]
  } else if (variant === 'two-tone') {
    return [
      MATERIAL_ICONS_CLASSNAME + 'two-tone',
      'Material+Icons+Two+Tone',
    ]
  } else {
    // This covers `variant === 'filled'`
    return [
      MATERIAL_ICONS_CLASSNAME,
      'Material+Icons',
    ]
  }
}
