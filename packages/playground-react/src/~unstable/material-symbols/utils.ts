import { isNumber } from '@glyph-cat/swiss-army-knife'
import { CSSProperties } from 'react'
import type { MaterialSymbolOptions } from '.'

// Last modified: 07/12/2024

function getCapitalizedVariantName(variant: MaterialSymbolOptions['variant']): string {
  switch (variant) {
    case 'outlined': return 'Outlined'
    case 'rounded': return 'Rounded'
    case 'sharp': return 'Sharp'
  }
}

function getFontStyleSheetURL(variant: MaterialSymbolOptions['variant']): string {
  return `https://fonts.googleapis.com/css2?family=Material+Symbols+${getCapitalizedVariantName(variant)}:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`
}

// #region Cached content

// https://fonts.gstatic.com/s/materialsymbolsoutlined/v206/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY.woff2

// https://fonts.gstatic.com/s/materialsymbolsoutlined/v206/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY.woff2
// https://fonts.gstatic.com/s/materialsymbolsrounded/v205/sykg-zNym6YjUruM-QrEh7-nyTnjDwKNJ_190FjzaqkNCeE.woff2
// https://fonts.gstatic.com/s/materialsymbolssharp/v202/gNMVW2J8Roq16WD5tFNRaeLQk6-SHQ_R00k4aWHSSmlN.woff2

// TODO: check generated link

// Last updated: 03/09/2024
function getCachedWoff2Url(variant: MaterialSymbolOptions['variant']): string {
  return `https://fonts.gstatic.com/s/materialsymbols${variant}/v${(() => {
    switch (variant) {
      case 'outlined': return '206/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY'
      case 'rounded': return '205/sykg-zNym6YjUruM-QrEh7-nyTnjDwKNJ_190FjzaqkNCeE'
      case 'sharp': return '202/gNMVW2J8Roq16WD5tFNRaeLQk6-SHQ_R00k4aWHSSmlN'
    }
  })()}.woff2`
}

function getCachedStyleSheet(variant: MaterialSymbolOptions['variant']): string {
  return [
    '/* fallback */',
    '@font-face {',
    `font-family: 'Material Symbols ${getCapitalizedVariantName(variant)}';`,
    'font-style: normal;',
    'font-weight: 100 700;',
    `src: url(${getCachedWoff2Url(variant)}) format('woff2');`,
    '}',
    '',
    `.material-symbols-${variant} {`,
    `font-family: 'Material Symbols ${getCapitalizedVariantName(variant)}';`,
    'font-weight: normal;',
    'font-style: normal;',
    'font-size: 24px;',
    'line-height: 1;',
    'letter-spacing: normal;',
    'text-transform: none;',
    'display: inline-block;',
    'white-space: nowrap;',
    'word-wrap: normal;',
    'direction: ltr;',
    'text-rendering: optimizeLegibility;',
    '-webkit-font-smoothing: antialiased;',
    '}',
  ].join('\n')
}

// #endregion Cached content

async function fetchStyleSheet(variant: MaterialSymbolOptions['variant']): Promise<string> {
  // KIV: need to test in various use cases: React for web, React Native, Electron
  try {
    return await (await fetch(getFontStyleSheetURL(variant))).text()
  } catch (e) {
    return getCachedStyleSheet(variant)
  }
}

export async function resolveStyleSheet(
  variant: MaterialSymbolOptions['variant'],
  customWoff2Url: string | undefined
): Promise<string> {
  const styleSheet = await fetchStyleSheet(variant)
  if (customWoff2Url) { styleSheet.replace(/https?.+\.woff2/, customWoff2Url) }
  return styleSheet
}

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

export function createFontVariationSettingsProp(
  fill: MaterialSymbolOptions['fill'],
  weight: MaterialSymbolOptions['weight'],
  grade: MaterialSymbolOptions['grade'],
  opticalSize: MaterialSymbolOptions['opticalSize'],
): Partial<Pick<CSSProperties, 'fontVariationSettings'>> {
  const list = createFontVariationSettings(fill, weight, grade, opticalSize)
  return list.length > 0 ? { fontVariationSettings: list.join(',') } : {}
}

export function determineOpticalSize(size: number): Exclude<MaterialSymbolOptions['opticalSize'], 'auto'> {
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
