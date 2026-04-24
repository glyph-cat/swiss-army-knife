import { getInspect } from './_internal'

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
