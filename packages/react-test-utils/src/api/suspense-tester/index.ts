import { createElement, PropsWithChildren, Suspense, useEffect } from 'react'
import {
  customRenderHook,
  type CustomRenderHookResult,
  type CustomRenderResultMetadata,
} from '../hook-tester'

export interface CustomSuspenseTesterResultMetadata extends CustomRenderResultMetadata {
  isSuspended: boolean
}

export interface CustomSuspenseTesterResult<Result, Props> extends Omit<CustomRenderHookResult<Result, Props>, 'getMetadata'> {
  getMetadata(): CustomSuspenseTesterResultMetadata
}

export function renderSuspenseTester<Result, Props>(
  ...args: Parameters<typeof customRenderHook<Result, Props>>
): CustomSuspenseTesterResult<Result, Props> {

  const metadata = { isSuspended: false }

  const FallbackComponent = (): undefined => {
    useEffect(() => {
      metadata.isSuspended = true
      return () => { metadata.isSuspended = false }
    }, [])
  }

  const wrapper = ({ children }: PropsWithChildren) => (
    createElement(Suspense, {
      fallback: createElement(FallbackComponent),
    }, children)
  )

  const [callback, options, ...remainingArgs] = args
  const hook = customRenderHook<Result, Props>(callback, {
    ...options,
    wrapper,
  }, ...remainingArgs)

  return {
    ...hook,
    getMetadata: () => ({
      ...hook.getMetadata(),
      ...metadata,
    }),
  }

}
