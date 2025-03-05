import { StringRecord } from '../../../types'

/**
 * @public
 */
export interface ITheme {
  readonly id: string,
  readonly colorScheme: ColorScheme
  readonly palette: Readonly<IThemePalette>
  readonly spacing: Readonly<ISpacingDefinition>
}

/**
 * @public
 */
export interface ISpacingDefinition {
  None: number
  XXXS: number
  XXS: number
  XS: number
  S: number
  M: number
  L: number
  XL: number
  XXL: number
  XXXL: number
}

/**
 * @public
 */
export interface IBaseThemePalette {
  tint: StringColorValue
  appBg: StringColorValue
  appText: StringColorValue
  separator: StringColorValue
  neutralColor: StringColorValue
  infoColor: StringColorValue
  successColor: StringColorValue
  warnColor: StringColorValue
  errorColor: StringColorValue
  dangerColor: StringColorValue
}

/**
 * @public
 */
export type StringColorValue = string

/**
 * @public
 */
export interface IThemePalette extends IBaseThemePalette {
  tintLighter: StringColorValue
  tintDarker: StringColorValue
  tint20: StringColorValue
  tint40: StringColorValue
  tint60: StringColorValue
  tint80: StringColorValue
  tintedTextColor: StringColorValue
  tintedTextColorLighter: StringColorValue
  tintedTextColorDarker: StringColorValue
  appBg2: StringColorValue
  appBg3: StringColorValue
  appBg4: StringColorValue
  appText2: StringColorValue
  appText3: StringColorValue
  appText4: StringColorValue
  separator2: StringColorValue
  separator3: StringColorValue
  separator4: StringColorValue
}

/**
 * @public
 */
export enum ColorScheme {
  dark = 'dark',
  light = 'light',
}

/**
 * @public
 */
export enum LenientColorScheme {
  dark = ColorScheme.dark,
  light = ColorScheme.light,
  auto = 'auto',
}

/**
 * @public
 */
export type CSSVariableRecord = StringRecord<string | number>
