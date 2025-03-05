import { Color } from '../../../color'
import {
  ColorScheme,
  CSSVariableRecord,
  IBaseThemePalette,
  ISpacingDefinition,
  ITheme,
  IThemePalette,
} from '../abstractions'

/**
 * @public
 */
export class Theme<
  BaseThemePalette extends IBaseThemePalette = IBaseThemePalette,
  CustomValues extends CSSVariableRecord = CSSVariableRecord,
> implements ITheme {

  // #region Defaults

  // TODO: default light palette

  // TODO: default dark palette

  static readonly DEFAULT_SPACING: Readonly<ISpacingDefinition> = {
    None: 0,
    XXXS: 1,
    XXS: 2,
    XS: 3,
    S: 5,
    M: 10,
    L: 15,
    XL: 20,
    XXL: 40,
    XXXL: 60,
  }

  // #endregion Defaults

  readonly palette: Readonly<IThemePalette>
  readonly spacing: Readonly<ISpacingDefinition>

  constructor(
    public readonly id: string,
    public readonly colorScheme: ColorScheme,
    basePalette: BaseThemePalette,
    spacing?: Partial<ISpacingDefinition>,
    customValues?: Readonly<CustomValues>,
  ) {

    const { tint, appBg, appText, separator } = basePalette
    const isLightColorScheme = colorScheme === ColorScheme.light

    const tintSrc = Color.fromString(tint)
    const tintLighter = adjustLightness(tintSrc, 1.1).toString()
    const tintDarker = adjustLightness(tintSrc, 0.9).toString()

    const appBgSrc = Color.fromString(appBg)
    const appBg2 = adjustLightness(appBgSrc, isLightColorScheme ? 0.9 : 1.1).toString()
    const appBg3 = adjustLightness(appBgSrc, isLightColorScheme ? 0.8 : 1.2).toString()
    const appBg4 = adjustLightness(appBgSrc, isLightColorScheme ? 0.7 : 1.3).toString()

    const appTextSrc = Color.fromString(appText)
    const appText2 = adjustLightness(appTextSrc, isLightColorScheme ? 1.1 : 0.9).toString()
    const appText3 = adjustLightness(appTextSrc, isLightColorScheme ? 1.2 : 0.8).toString()
    const appText4 = adjustLightness(appTextSrc, isLightColorScheme ? 1.3 : 0.7).toString()

    const separatorSrc = Color.fromString(separator)
    const separator2 = adjustLightness(separatorSrc, isLightColorScheme ? 1.1 : 0.9).toString()
    const separator3 = adjustLightness(separatorSrc, isLightColorScheme ? 1.2 : 0.8).toString()
    const separator4 = adjustLightness(separatorSrc, isLightColorScheme ? 1.3 : 0.7).toString()

    this.palette = {
      ...basePalette,
      tintLighter,
      tintDarker,
      tint20: `${tint}20`,
      tint40: `${tint}40`,
      tint60: `${tint}60`,
      tint80: `${tint}80`,
      // TODO: Check contrast and increase legibility of tinted text colors
      tintedTextColor: tint,
      tintedTextColorLighter: tintLighter,
      tintedTextColorDarker: tintDarker,
      appBg2,
      appBg3,
      appBg4,
      appText2,
      appText3,
      appText4,
      separator2,
      separator3,
      separator4,
      ...customValues,
    }

    this.spacing = {
      ...Theme.DEFAULT_SPACING,
      ...spacing,
    }

  }

}

function adjustLightness(colorSource: Color, lightnessMultiplier: number): Color {
  return Color.fromHSL({
    hue: colorSource.hue,
    saturation: colorSource.saturation,
    lightness: colorSource.lightness * lightnessMultiplier,
  })
}
