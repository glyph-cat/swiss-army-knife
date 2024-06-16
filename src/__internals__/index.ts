import { useEffect } from 'react'
import { LIB_BUILD_TYPE } from '../constants'
import { devError } from '../dev'

export function handleUnsupportedPlatform(featureName: string): void {
  devError([
    `${featureName} is not supported`,
    LIB_BUILD_TYPE === 'rn' ? 'in React Native' : 'on the web',
  ].join(' '))
}

export function useUnsupportedPlatformHandler(featureName: string): void {
  useEffect(() => { handleUnsupportedPlatform(featureName) }, [featureName])
}
