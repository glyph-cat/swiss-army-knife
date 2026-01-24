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
  expect(EXPERIMENTAL_isPending((async () => { /* ... */ })())).toBe(false)
  // expect(EXPERIMENTAL_isPending((async () => { throw new Error() })())).toBe(false)
  expect(EXPERIMENTAL_isPending(new Promise<void>(() => { /* ... */ }))).toBe(true)
  // expect(EXPERIMENTAL_isPending(new Promise<void>(() => { throw new Error() }))).toBe(false)
  expect(EXPERIMENTAL_isPending(new Promise<void>((resolve) => { resolve() }))).toBe(false)
  // expect(EXPERIMENTAL_isPending(new Promise<void>((_, reject) => { reject() }))).toBe(false)
  expect(EXPERIMENTAL_isPending(Promise.resolve())).toBe(false)
  expect(EXPERIMENTAL_isPending(PROMISE_REJECT)).toBe(false)
})

test.skip(EXPERIMENTAL_isSettled.name, () => {
  expect(EXPERIMENTAL_isSettled((async () => { /* ... */ })())).toBe(true)
  // expect(EXPERIMENTAL_isSettled((async () => { throw new Error() })())).toBe(true)
  expect(EXPERIMENTAL_isSettled(new Promise<void>(() => { /* ... */ }))).toBe(false)
  // expect(EXPERIMENTAL_isSettled(new Promise<void>(() => { throw new Error() }))).toBe(true)
  expect(EXPERIMENTAL_isSettled(new Promise<void>((resolve) => { resolve() }))).toBe(true)
  // expect(EXPERIMENTAL_isSettled(new Promise<void>((_, reject) => { reject() }))).toBe(true)
  expect(EXPERIMENTAL_isSettled(Promise.resolve())).toBe(true)
  expect(EXPERIMENTAL_isSettled(PROMISE_REJECT)).toBe(true)
})

test.skip(EXPERIMENTAL_isResolved.name, () => {
  expect(EXPERIMENTAL_isResolved((async () => { /* ... */ })())).toBe(true)
  // expect(EXPERIMENTAL_isResolved((async () => { throw new Error() })())).toBe(false)
  expect(EXPERIMENTAL_isResolved(new Promise<void>(() => { /* ... */ }))).toBe(false)
  // expect(EXPERIMENTAL_isResolved(new Promise<void>(() => { throw new Error() }))).toBe(false)
  expect(EXPERIMENTAL_isResolved(new Promise<void>((resolve) => { resolve() }))).toBe(true)
  // expect(EXPERIMENTAL_isResolved(new Promise<void>((_, reject) => { reject() }))).toBe(false)
  expect(EXPERIMENTAL_isResolved(Promise.resolve())).toBe(true)
  expect(EXPERIMENTAL_isResolved(PROMISE_REJECT)).toBe(false)
})

test.skip(EXPERIMENTAL_isRejected.name, () => {
  expect(EXPERIMENTAL_isRejected((async () => { /* ... */ })())).toBe(false)
  // expect(EXPERIMENTAL_isRejected((async () => { throw new Error() })())).toBe(true)
  expect(EXPERIMENTAL_isRejected(new Promise<void>(() => { /* ... */ }))).toBe(false)
  // expect(EXPERIMENTAL_isRejected(new Promise<void>(() => { throw new Error() }))).toBe(true)
  expect(EXPERIMENTAL_isRejected(new Promise<void>((resolve) => { resolve() }))).toBe(false)
  // expect(EXPERIMENTAL_isRejected(new Promise<void>((_, reject) => { reject() }))).toBe(true)
  expect(EXPERIMENTAL_isRejected(Promise.resolve())).toBe(false)
  expect(EXPERIMENTAL_isRejected(PROMISE_REJECT)).toBe(true)
})

// NOTE: Seems like it is not possible to test for rejected promises??
// Is there a way for jest to ignore a specific rejected promises?

// test.only('x', async () => {
//   try {
//     await Promise.reject(42)
//   } catch (pr) {
//     // eslint-disable-next-line jest/no-conditional-expect
//     expect(EXPERIMENTAL_isRejected(pr)).toBe(true)
//   }
// })
