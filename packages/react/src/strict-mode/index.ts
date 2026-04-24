import { StringRecord } from '@glyph-cat/foundation'
import { useId } from 'react'

const StrictModeCheckStore: StringRecord<Array<unknown>> = {}

/**
 * NOTE: This relies on the [`useId`](https://react.dev/reference/react/useId)
 * hook which is only available in React 18 and above.
 *
 * @returns `true` if the component calling this hook is running in
 * [`StrictMode`](https://react.dev/reference/react/StrictMode).
 */
export function useCheckStrictMode(): boolean {
  // Component-specific ID must be used multiple instances of this hook can exist.
  const id = useId()
  /* eslint-disable react-hooks/immutability */
  if (!StrictModeCheckStore[id]) {
    StrictModeCheckStore[id] = []
  }
  StrictModeCheckStore[id].push(null)
  /* eslint-enable react-hooks/immutability */
  return StrictModeCheckStore[id]?.length > 1
}
