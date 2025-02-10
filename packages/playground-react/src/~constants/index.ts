export const INTERNAL_APP_IDENTIFIER = 'glyph-cat-playground-react'

export enum FixedKeyChordKey {
  SOFT_RELOAD = 'r',
  HIDE_PERFORMANCE_DEBUGGER = 'g',
}

export const AppRoute = {
  ROOT: '/',
  API: '/api',
  SANDBOX: '/sandbox',
} as const

export const APIRoute = {
  sandboxes: {
    getAll: `${AppRoute.API}/sandboxes/get-all`,
  },
} as const

// #region Other exports
export * from './env'
// #endregion Other exports
