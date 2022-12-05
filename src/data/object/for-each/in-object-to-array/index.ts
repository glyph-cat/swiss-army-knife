import { Awaitable } from '../../../../types'
import { ForEachInObjectContinuableCallbackArguments } from '../in-object'
import { breakSymbolGenerator } from '../internals'
import {
  BreakLoopSyntaxError,
  MismatchedBreakLoopError,
  MultipleBreakLoopError,
} from '../errors'

/**
 * Loops through each property in an object and creates an array out of it.
 * @param sourceObject - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object, then returns a (derived) value, where the values returned in each
 * iteration are aggregated into an array. To exclude an item from being
 * aggregated into the array, akin to `continue` statement, `return NOTHING`.
 * @returns The aggregated array.
 * @example
 * const output = forEachInObjectToArray(collection, ({ index, key, value, breakLoop, NOTHING }) => {
 *   if (conditionA) {
 *     return NOTHING
 *   } else if (conditionB) {
 *     return breakLoop()
 *   } else {
 *     return someValue
 *   }
 * })
 * @public
 */
export function forEachInObjectToArray<SourceObject, DerivedItem>(
  sourceObject: SourceObject,
  callback: (args: ForEachInObjectContinuableCallbackArguments<SourceObject>) => DerivedItem
): Array<DerivedItem> {
  const payload = []
  const keyStack = Object.keys(sourceObject) as Array<keyof SourceObject>
  const breakSymbol = breakSymbolGenerator.M$create()
  const exclusionSymbol = Symbol()
  let shouldBreakLoop = false
  const breakLoop = (): symbol => {
    if (shouldBreakLoop) {
      throw new MultipleBreakLoopError(forEachInObjectToArray.name)
    }
    shouldBreakLoop = true
    return breakSymbol
  }
  let i = 0
  for (const key of keyStack) {
    const value = callback({
      index: i++,
      key,
      value: sourceObject[key],
      breakLoop,
      NOTHING: exclusionSymbol,
    })
    if (shouldBreakLoop) {
      if (!Object.is(value, breakSymbol)) {
        throw new BreakLoopSyntaxError(forEachInObjectToArray.name)
      }
      breakSymbolGenerator.M$revoke(value as symbol)
      break
    } else if (breakSymbolGenerator.M$has(value as symbol)) {
      throw new MismatchedBreakLoopError(forEachInObjectToArray.name)
    }
    if (!Object.is(value, exclusionSymbol)) {
      payload.push(value)
    }
  }
  return payload
}

/**
 * Loops through each property in an object and creates an array out of it.
 * @param sourceObject - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object, then returns a (derived) value, where the values returned in each
 * iteration are aggregated into an array. To exclude an item from being
 * aggregated into the array, akin to `continue` statement, `return NOTHING`.
 * @returns The aggregated array.
 * @example
 * const output = await forEachInObjectToArrayAsync(collection, async({ index, key, value, breakLoop, NOTHING }) => {
 *   if (conditionA) {
 *     return NOTHING
 *   } else if (conditionB) {
 *     return breakLoop()
 *   } else {
 *     return someValue
 *   }
 * })
 * @public
 */
export async function forEachInObjectToArrayAsync<SourceObject, DerivedItem>(
  sourceObject: SourceObject,
  callback: (args: ForEachInObjectContinuableCallbackArguments<SourceObject>) => Awaitable<DerivedItem>
): Promise<Array<DerivedItem>> {
  const payload = []
  const keyStack = Object.keys(sourceObject) as Array<keyof SourceObject>
  const breakSymbol = breakSymbolGenerator.M$create()
  const exclusionSymbol = Symbol()
  let shouldBreakLoop = false
  const breakLoop = (): symbol => {
    if (shouldBreakLoop) {
      throw new MultipleBreakLoopError(forEachInObjectToArrayAsync.name)
    }
    shouldBreakLoop = true
    return breakSymbol
  }
  let i = 0
  for (const key of keyStack) {
    const value = await callback({
      index: i++,
      key,
      value: sourceObject[key],
      breakLoop,
      NOTHING: exclusionSymbol,
    })
    if (shouldBreakLoop) {
      if (!Object.is(value, breakSymbol)) {
        throw new BreakLoopSyntaxError(forEachInObjectToArray.name)
      }
      breakSymbolGenerator.M$revoke(value as symbol)
      break
    } else if (breakSymbolGenerator.M$has(value as symbol)) {
      throw new MismatchedBreakLoopError(forEachInObjectToArray.name)
    }
    if (!Object.is(value, exclusionSymbol)) {
      payload.push(value)
    }
  }
  return payload
}
