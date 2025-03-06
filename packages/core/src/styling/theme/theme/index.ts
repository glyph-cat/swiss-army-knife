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
    appBgColor: '#eeeeee',
    appTextColor: '#4b4b4b',
    separatorColor: '#808080',
    neutralColor: '#6680aa',
    infoColor: '#00cccc',
    successColor: '#008000',
    warnColor: '#ee6600',
    errorColor: '#ff3333',
    dangerColor: '#ff4a4a',
  }

  static DEFAULT_DARK_BASE_PALETTE: Readonly<IBaseThemePalette> = {
    tint: '#2b80ff',
    appBgColor: '#111111',
    appTextColor: '#b5b5b5',
    separatorColor: '#808080',
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

  // TODO: include shadow styles as well

  // #endregion Defaults

  readonly palette: Readonly<IThemePalette>
  readonly spacing: Readonly<ISpacingDefinition>
  readonly componentParameters: Readonly<IComponentParameters>

  constructor(
    public readonly id: string,
    public readonly colorScheme: ColorScheme,
    // TODO: Refactor params below with config object
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

    const { tint, appBgColor, appTextColor, separatorColor } = basePalette

    const tintSrc = Color.fromString(tint)
    const tintLighter = adjustLightness(tintSrc, 1.1).toString()
    const tintDarker = adjustLightness(tintSrc, 0.9).toString()

    const appBgColorSrc = Color.fromString(appBgColor)
    const appBgColor2 = adjustLightness(appBgColorSrc, isLightColorScheme ? 0.9 : 1.1).toString()
    const appBgColor3 = adjustLightness(appBgColorSrc, isLightColorScheme ? 0.8 : 1.2).toString()
    const appBgColor4 = adjustLightness(appBgColorSrc, isLightColorScheme ? 0.7 : 1.3).toString()

    const appTextColorSrc = Color.fromString(appTextColor)
    const appTextColor2 = adjustLightness(appTextColorSrc, isLightColorScheme ? 1.1 : 0.9).toString()
    const appTextColor3 = adjustLightness(appTextColorSrc, isLightColorScheme ? 1.2 : 0.8).toString()
    const appTextColor4 = adjustLightness(appTextColorSrc, isLightColorScheme ? 1.3 : 0.7).toString()

    const separatorColorSrc = Color.fromString(separatorColor)
    const separatorColor2 = adjustLightness(separatorColorSrc, isLightColorScheme ? 1.1 : 0.9).toString()
    const separatorColor3 = adjustLightness(separatorColorSrc, isLightColorScheme ? 1.2 : 0.8).toString()
    const separatorColor4 = adjustLightness(separatorColorSrc, isLightColorScheme ? 1.3 : 0.7).toString()

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
      appBgColor2: appBgColor2,
      appBgColor3: appBgColor3,
      appBgColor4: appBgColor4,
      appTextColor2: appTextColor2,
      appTextColor3: appTextColor3,
      appTextColor4: appTextColor4,
      separatorColor2: separatorColor2,
      separatorColor3: separatorColor3,
      separatorColor4: separatorColor4,
    }

    this.spacing = {
      ...Theme.DEFAULT_SPACING,
      ...spacing,
    }

    this.componentParameters = {
      ...Theme.DEFAULT_COMPONENT_PARAMETERS,
      ...componentParameters,
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
