import { Awaitable } from '../../../../types'
import { MultipleBreakLoopError } from '../errors'

/**
 * @public
 */
export interface ForEachInObjectCallbackArguments<SourceObject> {
  /**
   * Index of the current property.
   */
  index: number
  /**
   * Key of the current property.
   */
  key: keyof SourceObject,
  /**
   * Value of the current property.
   */
  value: SourceObject[keyof SourceObject],
  /**
   * Invoke this function to break the loop.
   */
  breakLoop(): void
}

/**
 * @public
 */
export interface ForEachInObjectContinuableCallbackArguments<SourceObject> extends ForEachInObjectCallbackArguments<SourceObject> {
  /**
   * Invoke this function to break the loop.
   */
  breakLoop(): symbol
  /**
   * An object to return to skip the current iteration and add nothing to the array.
   */
  NOTHING: symbol
}

/**
 * Loops through each property in an object.
 * @param sourceObject - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object.
 * @example
 * forEachInObject(collection, ({ index, key, value, breakLoop }) => {
 *   if (someCondition) { return breakLoop() }
 * })
 * @public
 */
export function forEachInObject<SourceObject>(
  sourceObject: SourceObject,
  callback: (args: ForEachInObjectCallbackArguments<SourceObject>) => void
): void {
  const keyStack = Object.keys(sourceObject) as Array<keyof SourceObject>
  let shouldBreakLoop = false
  const breakLoop = (): void => {
    if (shouldBreakLoop) {
      throw new MultipleBreakLoopError(forEachInObject.name)
    }
    shouldBreakLoop = true
  }
  let i = 0
  for (const key of keyStack) {
    callback({
      index: i++,
      key,
      value: sourceObject[key],
      breakLoop,
    })
    if (shouldBreakLoop) { break }
  }
}

/**
 * Loops through each property in an object.
 * @param sourceObject - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object.
 * @example
 * await forEachInObjectAsync(collection, async ({ index, key, value, breakLoop }) => {
 *   if (someCondition) { return breakLoop() }
 * })
 * @public
 */
export async function forEachInObjectAsync<SourceObject>(
  sourceObject: SourceObject,
  callback: (args: ForEachInObjectCallbackArguments<SourceObject>) => Awaitable<void>
): Promise<void> {
  const keyStack = Object.keys(sourceObject) as Array<keyof SourceObject>
  let shouldBreakLoop = false
  const breakLoop = (): void => {
    if (shouldBreakLoop) {
      throw new MultipleBreakLoopError(forEachInObject.name)
    }
    shouldBreakLoop = true
  }
  let i = 0
  for (const key of keyStack) {
    await callback({
      index: i++,
      key,
      value: sourceObject[key],
      breakLoop,
    })
    if (shouldBreakLoop) { break }
  }
}
