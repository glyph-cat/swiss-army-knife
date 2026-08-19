import { renderHook } from '@testing-library/react'

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
