import { StringRecord } from '@glyph-cat/foundation'
import { useId } from 'react'

const StrictModeCheckStore: StringRecord<Array<unknown>> = {}

/**
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
