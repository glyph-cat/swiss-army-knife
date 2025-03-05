import { Color } from '../../../color'
import {
  ColorScheme,
  CSSVariableRecord,
  IBaseThemePalette,
  IComponentParameters,
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

  static DEFAULT_LIGHT_BASE_PALETTE: Readonly<IBaseThemePalette> = {
    tint: '#2b80ff',
    appBg: '#eeeeee',
    appText: '#4b4b4b',
    separator: '#808080',
    neutralColor: '#6680aa',
    infoColor: '#00cccc',
    successColor: '#008000',
    warnColor: '#ee6600',
    errorColor: '#ff3333',
    dangerColor: '#ff4a4a',
  }

  static DEFAULT_DARK_BASE_PALETTE: Readonly<IBaseThemePalette> = {
    tint: '#2b80ff',
    appBg: '#111111',
    appText: '#b5b5b5',
    separator: '#808080',
    neutralColor: '#4b6680',
    infoColor: '#00cccc',
    successColor: '#00aa00',
    warnColor: '#ff8000',
    errorColor: '#ff4b4b',
    dangerColor: '#ff6666',
  }

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

  static readonly DEFAULT_COMPONENT_PARAMETERS: Readonly<IComponentParameters> = {
    inputElementBorderRadius: 5,
    inputElementBorderSize: 2,
  }
  // TODO: Shadow

  // #endregion Defaults

  readonly palette: Readonly<IThemePalette>
  readonly spacing: Readonly<ISpacingDefinition>
  readonly componentParameters: Readonly<IComponentParameters>

  constructor(
    public readonly id: string,
    public readonly colorScheme: ColorScheme,
    basePalette?: Partial<BaseThemePalette>,
    spacing?: Partial<ISpacingDefinition>,
    componentParameters?: Partial<IComponentParameters>, // TODO
    public readonly customValues = {} as Readonly<CustomValues>,
  ) {

    const isLightColorScheme = colorScheme === ColorScheme.light

    const mergedBasePalette: IBaseThemePalette = {
      ...(isLightColorScheme
        ? Theme.DEFAULT_LIGHT_BASE_PALETTE
        : Theme.DEFAULT_DARK_BASE_PALETTE
      ),
      ...basePalette,
    }

    const { tint, appBg, appText, separator } = basePalette

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
      ...mergedBasePalette,
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
    }

    this.spacing = {
      ...Theme.DEFAULT_SPACING,
      ...spacing,
    }

    this.componentParameters = {
      ...componentParameters,
      ...Theme.DEFAULT_COMPONENT_PARAMETERS,
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
