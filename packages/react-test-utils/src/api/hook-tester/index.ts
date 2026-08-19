import { renderHook } from '@testing-library/react'
import { createElement, PropsWithChildren, Suspense, useEffect } from 'react'

export interface CustomRenderResultMetadata {
  renderCount: number
}

export interface CustomRenderHookResult<Result, Props> extends ReturnType<typeof renderHook<Result, Props>> {
  getMetadata(): CustomRenderResultMetadata
  forceUpdate(): void
}

export function customRenderHook<Result, Props>(
  ...args: Parameters<typeof renderHook<Result, Props>>
): CustomRenderHookResult<Result, Props> {

  const metadata = { renderCount: 0 }
  let lastProps: Props | undefined

  const [callback, ...remainingArgs] = args
  const hook = renderHook((props) => {
    metadata.renderCount += 1
    lastProps = props
    return callback(props)
  }, ...remainingArgs)

  return {
    ...hook,
    getMetadata: () => metadata,
    forceUpdate: () => {
      hook.rerender(lastProps)
    },
  }

}

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
