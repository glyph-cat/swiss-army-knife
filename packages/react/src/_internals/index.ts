/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

import { InternalError } from '@glyph-cat/foundation'
import { TestProbeProvider } from '@glyph-cat/react-test-utils'
import { useContext } from 'react'
import { IS_SOURCE_ENV } from '../constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function __setDisplayName(item: any): void { /* ... */ }

export function __getDisplayName(item: any): string {
  return item['displayName'] ?? item['name']
}

export function throwInternalError(error: string | InternalError): never {
  console.error('This is most likely an internal software bug, please consider making a report at https://github.com/glyph-cat/swiss-army-knife/issues')
  if (error instanceof InternalError) {
    throw error
  } else {
    throw new InternalError(error)
  }
}

const TypeMarkerKey = '$$TypeMarker'

export enum TypeMarker {
  PopoverTrigger = 1,
  MenuTrigger,
  CoreNavStackItem,
  CoreNavBranchItem,
}

export function __setTypeMarker(component: any, type: TypeMarker): void {
  component[TypeMarkerKey] = type
}

export function __getTypeMarker(component: any): TypeMarker {
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
