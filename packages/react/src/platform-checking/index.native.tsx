import { checkIsApplePlatform } from '@glyph-cat/swiss-army-knife'
import { ReactNode } from 'react'
import type { CheckApplePlatformProviderProps } from '.'

export function CheckApplePlatformProvider({
  children,
}: CheckApplePlatformProviderProps): ReactNode {
  return children
}

export function useIsApplePlatform(): boolean {
  return checkIsApplePlatform()
}
