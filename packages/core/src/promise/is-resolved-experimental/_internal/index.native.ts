import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import type { inspect as $inspect } from 'util'

/**
 * @internal
 */
export function getInspect(): typeof $inspect {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const inspect: typeof $inspect = require('util').inspect
    return inspect
  } else {
    throw new UnsupportedPlatformError('The `inspect` function is not available')
  }
}
