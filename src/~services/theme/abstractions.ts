export enum ThemeId {
  DEFAULT_DARK = 'default-dark',
  DEFAULT_LIGHT = 'default-light',
}

export interface IThemeState {
  id: ThemeId
  auto: boolean
}
