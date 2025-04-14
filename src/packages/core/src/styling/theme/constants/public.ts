import { InternalValues } from '../abstractions'

/**
 * @public
 */
export const ThemeToken = {
  spacingNone: 'var(--spacingNone)',
  spacingXXXS: 'var(--spacingXXXS)',
  spacingXXS: 'var(--spacingXXS)',
  spacingXS: 'var(--spacingXS)',
  spacingS: 'var(--spacingS)',
  spacingM: 'var(--spacingM)',
  spacingL: 'var(--spacingL)',
  spacingXL: 'var(--spacingXL)',
  spacingXXL: 'var(--spacingXXL)',
  spacingXXXL: 'var(--spacingXXXL)',
  primaryColor: 'var(--primaryColor)',
  primaryColorLighter: 'var(--primaryColorLighter)',
  primaryColorDarker: 'var(--primaryColorDarker)',
  primaryColor20: 'var(--primaryColor20)',
  primaryColor40: 'var(--primaryColor40)',
  primaryColor60: 'var(--primaryColor60)',
  primaryColor80: 'var(--primaryColor80)',
  primaryTextColor: 'var(--primaryTextColor)',
  primaryTextColorLighter: 'var(--primaryTextColorLighter)',
  primaryTextColorDarker: 'var(--primaryTextColorDarker)',
  appBg: 'var(--appBg)',
  appBg2: 'var(--appBg2)',
  appBg3: 'var(--appBg3)',
  appBg4: 'var(--appBg4)',
  appText: 'var(--appText)',
  appText2: 'var(--appText2)',
  appText3: 'var(--appText3)',
  appText4: 'var(--appText4)',
  separator: 'var(--separator)',
  separator2: 'var(--separator2)',
  separator3: 'var(--separator3)',
  separator4: 'var(--separator4)',
  neutralColor: 'var(--neutralColor)',
  infoColor: 'var(--infoColor)',
  successColor: 'var(--successColor)',
  warnColor: 'var(--warnColor)',
  errorColor: 'var(--errorColor)',
  dangerColor: 'var(--dangerColor)',
  inputElementBorderRadius: 'var(--inputElementBorderRadius)',
  inputElementBorderSize: 'var(--inputElementBorderSize)',
  interactionAnimationDuration: 'var(--interactionAnimationDuration)',
  interactiveEnabledCursor: 'var(--interactiveEnabledCursor)',
  interactiveDisabledCursor: 'var(--interactiveDisabledCursor)',
} as const

/**
 * 📌 Reminder: internal
 * @internal
 */
export const InternalToken: Readonly<InternalValues> = {
  busyShadeA: 'var(--busyShadeA)',
  busyShadeB: 'var(--busyShadeB)',
  inputBorderColor: 'var(--inputBorderColor)',
  progressBg: 'var(--progressBg)',
  switchBackground: 'var(--switchBackground)',
  switchBorderColor: 'var(--switchBorderColor)',
  switchDisabledBackground: 'var(--switchDisabledBackground)',
  switchThumbStretchSize: 'var(--switchThumbStretchSize)',
  thumbColor: 'var(--thumbColor)',
} as const
