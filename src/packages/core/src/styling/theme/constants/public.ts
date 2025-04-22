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
  appBgColor: 'var(--appBgColor)',
  appBgColor2: 'var(--appBgColor2)',
  appBgColor3: 'var(--appBgColor3)',
  appBgColor4: 'var(--appBgColor4)',
  appTextColor: 'var(--appTextColor)',
  appTextColor2: 'var(--appTextColor2)',
  appTextColor3: 'var(--appTextColor3)',
  appTextColor4: 'var(--appTextColor4)',
  appTextColorStrong: 'var(--appTextColorStrong)',
  separatorColor: 'var(--separatorColor)',
  separatorColor2: 'var(--separatorColor2)',
  separatorColor3: 'var(--separatorColor3)',
  separatorColor4: 'var(--separatorColor4)',
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
  buttonDisabledColor: 'var(--buttonDisabledColor)',
} as const
