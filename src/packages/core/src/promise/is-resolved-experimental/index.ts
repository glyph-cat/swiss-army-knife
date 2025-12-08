import type { inspect as $inspect } from 'util'
import { UnsupportedPlatformError } from '../../error'

function getInspect(): typeof $inspect {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const inspect: typeof $inspect = require('util').inspect
    return inspect
  } else if (typeof window['inspect'] !== 'undefined') {
    return window['inspect']
  } else {
    throw new UnsupportedPlatformError('The `inspect` function is not available')
  }
}

export function EXPERIMENTAL_isPending(promise: Promise<unknown>): boolean {
  const inspectFn = getInspect()
  const inspectionResult = inspectFn(promise)
  return /<pending>/i.test(inspectionResult)
}

export function EXPERIMENTAL_isSettled(promise: Promise<unknown>): boolean {
  const inspectFn = getInspect()
  const inspectionResult = inspectFn(promise)
  return !/<pending>/i.test(inspectionResult)
}

export function EXPERIMENTAL_isResolved(promise: Promise<unknown>): boolean {
  const inspectFn = getInspect()
  const inspectionResult = inspectFn(promise)
  return !/<(pending|rejected)>/i.test(inspectionResult)
}

export function EXPERIMENTAL_isRejected(promise: Promise<unknown>): boolean {
  const inspectFn = getInspect()
  const inspectionResult = inspectFn(promise)
  return /<rejected>/i.test(inspectionResult)
}
