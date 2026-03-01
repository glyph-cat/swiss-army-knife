import { Platform } from 'react-native'

/**
 * @public
 */
export function checkIsApplePlatform(): boolean {
  const platformOS = Platform.OS
  return platformOS === 'ios' || platformOS === 'macos'
}

// #region Miscellaneous exports
export * from './constants/public'
// #endregion Miscellaneous exports
