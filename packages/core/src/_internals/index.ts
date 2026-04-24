/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

import { InternalError } from '@glyph-cat/foundation'

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
