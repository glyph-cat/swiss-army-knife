export const INTERNAL_APP_IDENTIFIER = 'glyph-cat-playground-react'
import sandboxStyles from './sandboxStyles.module.css'

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

export const SandboxStyle = {
  NORMAL: sandboxStyles.normal,
  FULL_HEIGHT: sandboxStyles.fullHeight,
} as const

// #region Other exports
export * from './env'
// #endregion Other exports
