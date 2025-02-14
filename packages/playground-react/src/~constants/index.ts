export const INTERNAL_APP_IDENTIFIER = 'glyph-cat-playground-react'
import sandboxStyles from './sandboxStyles.module.css'

export enum FixedKeyChordKey {
  HIDE_PERFORMANCE_DEBUGGER = 'g',
  RESTART_SERVER = 'q',
  SOFT_RELOAD = 'r',
}

export const AppRoute = {
  ROOT: '/',
  API: '/api',
  SANDBOX: '/sandbox',
} as const

export const APIRoute = {
  sandboxes: {
    create: `${AppRoute.API}/sandboxes/create`,
    getAll: `${AppRoute.API}/sandboxes/get-all`,
    openInEditor: `${AppRoute.API}/sandboxes/open-in-editor`,
  },
  utils: {
    restartServer: `${AppRoute.API}/utils/restart-server`,
  },
} as const

export const SandboxStyle = {
  NORMAL: sandboxStyles.normal,
  FULL_HEIGHT: sandboxStyles.fullHeight,
} as const

// #region Other exports
export * from './env'
// #endregion Other exports
