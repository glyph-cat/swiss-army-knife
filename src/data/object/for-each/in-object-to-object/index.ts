import { Awaitable, KeyValuePair } from '../../../../types'
import { ForEachInObjectContinuableCallbackArguments } from '../in-object'
import { breakSymbolGenerator } from '../internals'
import {
  BreakLoopSyntaxError,
  MismatchedBreakLoopError,
  MultipleBreakLoopError,
} from '../errors'

/**
 * Loops through each property in an object and creates a new object out of it.
 * @param sourceObject - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object, then returns a (derived) value, where the values returned in each
 * iteration are aggregated into a new object. To exclude an item from being
 * aggregated into the array, akin to `continue` statement, `return continueLoop()`.
 * @returns The aggregated object.
 * @example
 * const output = forEachInObjectToObject(collection, ({ index, key, value, breakLoop, NOTHING }) => {
 *   if (conditionA) {
 *     return NOTHING
 *   } else if (conditionB) {
 *     return breakLoop()
 *   } else {
 *     return [key, value]
 *   }
 * })
 * @public
 */
export function forEachInObjectToObject<SourceObject, DerivedKey extends PropertyKey, DerivedItem>(
  sourceObject: SourceObject,
  callback: (args: ForEachInObjectContinuableCallbackArguments<SourceObject>) => KeyValuePair<DerivedKey, DerivedItem> | symbol,
): Record<DerivedKey, DerivedItem> {
  const payload = {} as Record<DerivedKey, DerivedItem>
  const keyStack = Object.keys(sourceObject) as Array<keyof SourceObject>
  const breakSymbol = breakSymbolGenerator.M$create()
  const exclusionSymbol = Symbol()
  let shouldBreakLoop = false
  const breakLoop = (): symbol => {
    if (shouldBreakLoop) {
      throw new MultipleBreakLoopError(forEachInObjectToObject.name)
    }
    shouldBreakLoop = true
    return breakSymbol
  }
  let i = 0
  for (const key of keyStack) {
    const returnValue = callback({
      index: i++,
      key,
      value: sourceObject[key],
      breakLoop,
      NOTHING: exclusionSymbol,
    })
    if (shouldBreakLoop) {
      if (!Object.is(returnValue, breakSymbol)) {
        throw new BreakLoopSyntaxError(forEachInObjectToObject.name)
      }
      breakSymbolGenerator.M$revoke(returnValue as unknown as symbol)
      break
    } else if (breakSymbolGenerator.M$has(returnValue as unknown as symbol)) {
      throw new MismatchedBreakLoopError(forEachInObjectToObject.name)
    }
    if (!Object.is(returnValue, exclusionSymbol)) {
      const [newKey, newValue] = returnValue as KeyValuePair<DerivedKey, DerivedItem>
      payload[newKey] = newValue
    }
  }
  return payload
}

/**
 * Loops through each property in an object and creates a new object out of it.
 * @param sourceObject - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object, then returns a (derived) value, where the values returned in each
 * iteration are aggregated into a new object. To exclude an item from being
 * aggregated into the array, akin to `continue` statement, `return continueLoop()`.
 * @returns The aggregated object.
 * @example
 * const output = await forEachInObjectToObjectAsync(collection, async ({ index, key, value, breakLoop, NOTHING }) => {
 *   if (conditionA) {
 *     return NOTHING
 *   } else if (conditionB) {
 *     return breakLoop()
 *   } else {
 *     return [key, value]
 *   }
 * })
 * @public
 */
export async function forEachInObjectToObjectAsync<SourceObject, DerivedKey extends PropertyKey, DerivedItem>(
  sourceObject: SourceObject,
  callback: (args: ForEachInObjectContinuableCallbackArguments<SourceObject>) => Awaitable<KeyValuePair<DerivedKey, DerivedItem> | symbol>,
): Promise<Record<DerivedKey, DerivedItem>> {
  const payload = {} as Record<DerivedKey, DerivedItem>
  const keyStack = Object.keys(sourceObject) as Array<keyof SourceObject>
  const breakSymbol = breakSymbolGenerator.M$create()
  const exclusionSymbol = Symbol()
  let shouldBreakLoop = false
  const breakLoop = (): symbol => {
    if (shouldBreakLoop) {
      throw new MultipleBreakLoopError(forEachInObjectToObjectAsync.name)
    }
    shouldBreakLoop = true
    return breakSymbol
  }
  let i = 0
  for (const key of keyStack) {
    const returnValue = await callback({
      index: i++,
      key,
      value: sourceObject[key],
      breakLoop,
      NOTHING: exclusionSymbol,
    })
    if (shouldBreakLoop) {
      if (!Object.is(returnValue, breakSymbol)) {
        throw new BreakLoopSyntaxError(forEachInObjectToObjectAsync.name)
      }
      breakSymbolGenerator.M$revoke(returnValue as unknown as symbol)
      break
    } else if (breakSymbolGenerator.M$has(returnValue as unknown as symbol)) {
      throw new MismatchedBreakLoopError(forEachInObjectToObjectAsync.name)
    }
    if (!Object.is(returnValue, exclusionSymbol)) {
      const [newKey, newValue] = returnValue as KeyValuePair<DerivedKey, DerivedItem>
      payload[newKey] = newValue
    }
  }
  return payload
}
