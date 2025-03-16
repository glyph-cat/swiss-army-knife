import { StringRecord } from '../../../types'

/**
 * @public
 */
export type StringColorValue = string

/**
 * @public
 */
export type CSSVariableRecord = StringRecord<StringColorValue | number>

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
export interface ITheme {
  readonly id: string,
  readonly colorScheme: ColorScheme
  readonly palette: Readonly<IThemePalette>
  readonly spacing: Readonly<ISpacingDefinition>
}

/**
 * @public
 */
export interface IBaseThemePalette {
  primaryColor: StringColorValue
  appBgColor: StringColorValue
  appTextColor: StringColorValue
  separatorColor: StringColorValue
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
export interface IThemePalette extends IBaseThemePalette {
  primaryColorLighter: StringColorValue
  primaryColorDarker: StringColorValue
  primaryColor20: StringColorValue
  primaryColor40: StringColorValue
  primaryColor60: StringColorValue
  primaryColor80: StringColorValue
  primaryTextColor: StringColorValue
  primaryTextColorLighter: StringColorValue
  primaryTextColorDarker: StringColorValue
  appBgColor2: StringColorValue
  appBgColor3: StringColorValue
  appBgColor4: StringColorValue
  appTextColor2: StringColorValue
  appTextColor3: StringColorValue
  appTextColor4: StringColorValue
  separatorColor2: StringColorValue
  separatorColor3: StringColorValue
  separatorColor4: StringColorValue
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
export interface IComponentParameters {
  inputElementBorderRadius: number
  inputElementBorderSize: number
}
