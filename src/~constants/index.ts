export const INTERNAL_APP_IDENTIFIER = 'glyph-cat-playground-react'
import { c } from '@glyph-cat/swiss-army-knife'
import sandboxStyles from './sandboxStyles.module.css'

export const VALID_SANDBOX_NAME_PATTERN = /^[a-z0-9_-]+$/i

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
} as const

export const SandboxStyle = {
  NORMAL: c(sandboxStyles.base, sandboxStyles.normal),
  FULL_HEIGHT: c(sandboxStyles.base, sandboxStyles.fullHeight),
} as const

// #region Other exports
export * from './env'
// #endregion Other exports
