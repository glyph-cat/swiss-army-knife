import { Empty } from '@glyph-cat/foundation'
import {
  EXPERIMENTAL_isPending,
  EXPERIMENTAL_isRejected,
  EXPERIMENTAL_isResolved,
  EXPERIMENTAL_isSettled,
} from '.'
import { delay } from '../../events'

jest.useRealTimers()

const PROMISE_REJECT = Promise.reject().catch(Empty.FUNCTION)
beforeAll(() => delay(0)) // For `PROMISE_REJECT` to resolve
// TOFIX: Tests for promise rejection

test.skip(EXPERIMENTAL_isPending.name, () => {
  expect(EXPERIMENTAL_isPending((async () => { /* ... */ })())).toBeFalse()
  // expect(EXPERIMENTAL_isPending((async () => { throw new Error() })())).toBeFalse()
  expect(EXPERIMENTAL_isPending(new Promise<void>(() => { /* ... */ }))).toBeTrue()
  // expect(EXPERIMENTAL_isPending(new Promise<void>(() => { throw new Error() }))).toBeFalse()
  expect(EXPERIMENTAL_isPending(new Promise<void>((resolve) => { resolve() }))).toBeFalse()
  // expect(EXPERIMENTAL_isPending(new Promise<void>((_, reject) => { reject() }))).toBeFalse()
  expect(EXPERIMENTAL_isPending(Promise.resolve())).toBeFalse()
  expect(EXPERIMENTAL_isPending(PROMISE_REJECT)).toBeFalse()
})

test.skip(EXPERIMENTAL_isSettled.name, () => {
  expect(EXPERIMENTAL_isSettled((async () => { /* ... */ })())).toBeTrue()
  // expect(EXPERIMENTAL_isSettled((async () => { throw new Error() })())).toBeTrue()
  expect(EXPERIMENTAL_isSettled(new Promise<void>(() => { /* ... */ }))).toBeFalse()
  // expect(EXPERIMENTAL_isSettled(new Promise<void>(() => { throw new Error() }))).toBeTrue()
  expect(EXPERIMENTAL_isSettled(new Promise<void>((resolve) => { resolve() }))).toBeTrue()
  // expect(EXPERIMENTAL_isSettled(new Promise<void>((_, reject) => { reject() }))).toBeTrue()
  expect(EXPERIMENTAL_isSettled(Promise.resolve())).toBeTrue()
  expect(EXPERIMENTAL_isSettled(PROMISE_REJECT)).toBeTrue()
})

test.skip(EXPERIMENTAL_isResolved.name, () => {
  expect(EXPERIMENTAL_isResolved((async () => { /* ... */ })())).toBeTrue()
  // expect(EXPERIMENTAL_isResolved((async () => { throw new Error() })())).toBeFalse()
  expect(EXPERIMENTAL_isResolved(new Promise<void>(() => { /* ... */ }))).toBeFalse()
  // expect(EXPERIMENTAL_isResolved(new Promise<void>(() => { throw new Error() }))).toBeFalse()
  expect(EXPERIMENTAL_isResolved(new Promise<void>((resolve) => { resolve() }))).toBeTrue()
  // expect(EXPERIMENTAL_isResolved(new Promise<void>((_, reject) => { reject() }))).toBeFalse()
  expect(EXPERIMENTAL_isResolved(Promise.resolve())).toBeTrue()
  expect(EXPERIMENTAL_isResolved(PROMISE_REJECT)).toBeFalse()
})

test.skip(EXPERIMENTAL_isRejected.name, () => {
  expect(EXPERIMENTAL_isRejected((async () => { /* ... */ })())).toBeFalse()
  // expect(EXPERIMENTAL_isRejected((async () => { throw new Error() })())).toBeTrue()
  expect(EXPERIMENTAL_isRejected(new Promise<void>(() => { /* ... */ }))).toBeFalse()
  // expect(EXPERIMENTAL_isRejected(new Promise<void>(() => { throw new Error() }))).toBeTrue()
  expect(EXPERIMENTAL_isRejected(new Promise<void>((resolve) => { resolve() }))).toBeFalse()
  // expect(EXPERIMENTAL_isRejected(new Promise<void>((_, reject) => { reject() }))).toBeTrue()
  expect(EXPERIMENTAL_isRejected(Promise.resolve())).toBeFalse()
  expect(EXPERIMENTAL_isRejected(PROMISE_REJECT)).toBeTrue()
})

// NOTE: Seems like it is not possible to test for rejected promises??
// Is there a way for jest to ignore a specific rejected promises?

// test.only('x', async () => {
//   try {
//     await Promise.reject(42)
//   } catch (pr) {
//     // eslint-disable-next-line jest/no-conditional-expect
//     expect(EXPERIMENTAL_isRejected(pr)).toBeTrue()
//   }
// })
