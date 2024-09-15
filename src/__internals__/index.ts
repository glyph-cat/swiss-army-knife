import { useEffect } from 'react'
import { BUILD_TYPE, BuildType } from '../constants'
import { devError } from '../dev'

export function handleUnsupportedPlatform(featureName: string): void {
  devError([
    `${featureName} is not supported`,
    BUILD_TYPE === BuildType.RN ? 'in React Native' : 'on the web',
  ].join(' '))
}

export function useUnsupportedPlatformHandler(featureName: string): void {
  useEffect(() => { handleUnsupportedPlatform(featureName) }, [featureName])
}
