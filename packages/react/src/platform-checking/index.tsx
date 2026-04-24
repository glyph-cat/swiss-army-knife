import { APPLE_PLATFORM_REGEX, checkIsApplePlatform } from '@glyph-cat/swiss-army-knife'
import { createContext, JSX, ReactNode, useContext } from 'react'
import { useConstant } from '../hooks'

// NOTES:
// https://stackoverflow.com/questions/29033081/setting-os-specific-keybindings-cmd-on-mac-and-ctrl-on-everything-else

const ApplePlatformContext = createContext<boolean>(false)

/**
 * @public
 */
export interface CheckApplePlatformProviderProps {
  children?: ReactNode
  /**
   * User agent string can be manually passed to the provider to be evaluated.
   * This is useful if the user agent string from the HTTP request object is
   * passed down as a prop from methods such as `getServerSideProps` in NextJS.
   */
  userAgent?: string
  /**
   * In case platform cannot be determined, the value can be overridden if there
   * is a better custom logic.
   */
  overrideValue?: boolean
}

/**
 * @public
 */
export function CheckApplePlatformProvider({
  children,
  userAgent,
  overrideValue,
}: CheckApplePlatformProviderProps): JSX.Element {
  const isApplePlatform = useConstant(typeof window !== 'undefined' ? checkIsApplePlatform : false)
  const effectiveValue = overrideValue
    ? overrideValue
    : userAgent
      ? APPLE_PLATFORM_REGEX.test(userAgent)
      : isApplePlatform
  return (
    <ApplePlatformContext.Provider value={effectiveValue}>
      {children}
    </ApplePlatformContext.Provider>
  )
}

/**
 * A hook to check if the client environment is an Apple platform or not.
 * This is created mainly to help determine whether the [Ctrl] or [⌘] key
 * should be taken into consideration when listening for custom keyboard shortcuts.
 * @public
 */
export function useIsApplePlatform(): boolean {
  return useContext(ApplePlatformContext)
}
