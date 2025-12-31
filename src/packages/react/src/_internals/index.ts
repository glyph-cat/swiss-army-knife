import { TestProbeProvider } from '@glyph-cat/react-test-utils'
import { useContext } from 'react'
import { IS_SOURCE_ENV } from '../constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function __setDisplayName(item: unknown): void { /* ... */ }

export function __getDisplayName(item: unknown): string {
  return item['displayName'] ?? item['name']
}

const TypeMarkerKey = '$$TypeMarker'

export enum TypeMarker {
  PopoverTrigger = 1,
  MenuTrigger,
  CoreNavStackItem,
  CoreNavBranchItem,
}

export function __setTypeMarker(component: unknown, type: TypeMarker): void {
  component[TypeMarkerKey] = type
}

export function __getTypeMarker(component: unknown): TypeMarker {
  return component[TypeMarkerKey]
}

export function useTestProbe(key: string): void {
  if (!IS_SOURCE_ENV) {
    return // Early exit
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const testProbe = useContext(TestProbeProvider)
  if (!testProbe) {
    return // Early exit - not mandatory
    // throw new Error('Component must be wrapped in a <TestProbeProvider>')
  }
  if (!key) {
    throw new Error('Missing mandatory parameter `key`')
  }
  testProbe.M$bumpRenderCount(key)
}
