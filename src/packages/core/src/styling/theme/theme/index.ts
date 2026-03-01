import { Color, HSLColor } from '../../../color'
import {
  ColorScheme,
  CSSVariableRecord,
  IBaseThemePalette,
  IComponentParameters,
  IDurationDefinition,
  InternalValues,
  ISpacingDefinition,
  ITheme,
  IThemePalette,
} from '../abstractions'

/**
 * @public
 */
export interface ThemeOptions {
  basePalette?: Partial<IBaseThemePalette>
  spacing?: Partial<ISpacingDefinition>
  duration?: Partial<IDurationDefinition>
  componentParameters?: Partial<IComponentParameters>
}

const DEFAULT_PRIMARY_COLOR = '#2b80ff'
const DEFAULT_PRIMARY_COLOR_SOURCE = new Color(DEFAULT_PRIMARY_COLOR).asHSL()

/**
 * @public
 */
export class Theme<CustomValues extends CSSVariableRecord = CSSVariableRecord> implements ITheme {

  // #region Defaults

  static readonly DEFAULT_LIGHT_BASE_PALETTE: Readonly<IBaseThemePalette> = {
    primaryColor: DEFAULT_PRIMARY_COLOR,
    appBgColor: '#eeeeee',
    appTextColor: '#4b4b4b',
    separatorColor: '#808080',
    // neutralColor: '#6680aa',
    neutralColor: new Color(Color.hsl(
      DEFAULT_PRIMARY_COLOR_SOURCE.h,
      DEFAULT_PRIMARY_COLOR_SOURCE.s * 0.15,
      Math.min(DEFAULT_PRIMARY_COLOR_SOURCE.l * 1.2, 100),
    )).asHex().toString(),
    infoColor: '#00cccc',
    successColor: '#008000',
    warnColor: '#ee6600',
    errorColor: '#ff3333',
    dangerColor: '#ff4a4a',
  }

  static readonly DEFAULT_DARK_BASE_PALETTE: Readonly<IBaseThemePalette> = {
    primaryColor: DEFAULT_PRIMARY_COLOR,
    appBgColor: '#111111',
    appTextColor: '#b5b5b5',
    separatorColor: '#808080',
    // neutralColor: '#2d475f',
    neutralColor: new Color(Color.hsl(
      DEFAULT_PRIMARY_COLOR_SOURCE.h,
      DEFAULT_PRIMARY_COLOR_SOURCE.s * 0.15,
      DEFAULT_PRIMARY_COLOR_SOURCE.l * 0.4,
    )).asHex().toString(),
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

  static readonly DEFAULT_DURATION: Readonly<IDurationDefinition> = {
    VERY_SHORT: 50,
    SHORT: 100,
    MEDIUM: 200,
    LONG: 300,
    VERY_LONG: 500,
    EXTRA_LONG: 750,
  }

  static readonly DEFAULT_COMPONENT_PARAMETERS: Readonly<IComponentParameters> = {
    inputElementBorderRadius: 5,
    inputElementBorderSize: 2,
    interactionAnimationDuration: '150ms',
    interactiveEnabledCursor: 'pointer',
    interactiveDisabledCursor: 'not-allowed',
  }

  // TODO: include shadow styles as well

  // #endregion Defaults

  readonly palette: Readonly<IThemePalette>
  readonly spacing: Readonly<ISpacingDefinition>
  readonly duration: Readonly<IDurationDefinition>
  readonly componentParameters: Readonly<IComponentParameters>

  /**
   * @internal
   */
  readonly internalValues = {} as Readonly<InternalValues>

  constructor(
    public readonly colorScheme: ColorScheme,
    options?: ThemeOptions,
    public readonly customValues = {} as Readonly<CustomValues>,
  ) {

    const isLightColorScheme = colorScheme === ColorScheme.light

    const mergedBasePalette: IBaseThemePalette = {
      ...(isLightColorScheme
        ? Theme.DEFAULT_LIGHT_BASE_PALETTE
        : Theme.DEFAULT_DARK_BASE_PALETTE
      ),
      ...options?.basePalette,
    }

    const { primaryColor, appBgColor, appTextColor, separatorColor } = mergedBasePalette

    const primaryColorHSL = new Color(primaryColor).asHSL()
    const primaryColorLighter = new Color(adjustLightness(primaryColorHSL, 1.1)).asHex().toString()
    const primaryColorDarker = new Color(adjustLightness(primaryColorHSL, 0.9)).asHex().toString()

    const appBgColorHSL = new Color(appBgColor).asHSL()
    const appTextColorHSL = new Color(appTextColor).asHSL()
    const separatorColorHSL = new Color(separatorColor).asHSL()

    this.palette = {
      ...mergedBasePalette,
      primaryColorLighter,
      primaryColorDarker,
      primaryColor20: `${primaryColor}20`,
      primaryColor40: `${primaryColor}40`,
      primaryColor60: `${primaryColor}60`,
      primaryColor80: `${primaryColor}80`,
      // TODO: Check contrast and increase legibility of primary text colors
      primaryTextColor: primaryColor,
      primaryTextColorLighter: primaryColorLighter,
      primaryTextColorDarker: primaryColorDarker,
      appBgColor2: new Color(adjustLightness(appBgColorHSL, isLightColorScheme ? 0.9 : 1.1)).asHex().toString(),
      appBgColor3: new Color(adjustLightness(appBgColorHSL, isLightColorScheme ? 0.8 : 1.2)).asHex().toString(),
      appBgColor4: new Color(adjustLightness(appBgColorHSL, isLightColorScheme ? 0.7 : 1.3)).asHex().toString(),
      appTextColor2: new Color(adjustLightness(appTextColorHSL, isLightColorScheme ? 1.1 : 0.9)).asHex().toString(),
      appTextColor3: new Color(adjustLightness(appTextColorHSL, isLightColorScheme ? 1.2 : 0.8)).asHex().toString(),
      appTextColor4: new Color(adjustLightness(appTextColorHSL, isLightColorScheme ? 1.3 : 0.7)).asHex().toString(),
      appTextColorStrong: isLightColorScheme ? '#000000' : '#ffffff',
      separatorColor2: new Color(adjustLightness(separatorColorHSL, isLightColorScheme ? 1.1 : 0.9)).asHex().toString(),
      separatorColor3: new Color(adjustLightness(separatorColorHSL, isLightColorScheme ? 1.2 : 0.8)).asHex().toString(),
      separatorColor4: new Color(adjustLightness(separatorColorHSL, isLightColorScheme ? 1.3 : 0.7)).asHex().toString(),
    }

    this.spacing = {
      ...Theme.DEFAULT_SPACING,
      ...options?.spacing,
    }

    this.duration = {
      ...Theme.DEFAULT_DURATION,
      ...options?.duration,
    }

    this.componentParameters = {
      ...Theme.DEFAULT_COMPONENT_PARAMETERS,
      ...options?.componentParameters,
    }

    const inputBorderColor = '#808080'
    this.internalValues = {
      busyShadeA: '#80808040',
      busyShadeB: `#808080${isLightColorScheme ? '00' : '20'}`,
      inputBorderColor,
      progressBg: `#000000${isLightColorScheme ? '10' : '40'}`,
      switchBackground: isLightColorScheme ? '#4b4b4b40' : '#00000000',
      switchBorderColor: isLightColorScheme ? '#80808040' : inputBorderColor,
      switchDisabledBackground: isLightColorScheme ? '#80808020' : '#00000000',
      switchThumbStretchSize: '5px',
      thumbColor: isLightColorScheme ? '#ffffff' : '#eeeeee',
      buttonDisabledColor: isLightColorScheme ? '#b5b5b5' : '#4b4b4b',
    }

  }

}

function adjustLightness(color: HSLColor, lightnessMultiplier: number): HSLColor {
  return new HSLColor(color.h, color.s, color.l * lightnessMultiplier, color.a)
}
