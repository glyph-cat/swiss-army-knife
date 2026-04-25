import { NumericDataSet } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

// console.log(JSON.stringify([].sort((a, b) => b - a)))
// [104.95, 85.45, 52.93, 52.64, 49.6, 49.36, 45.33, 44.65, 40.53, 40.36, 34.38, 15.33, 10, 7, 7, 6, 6, 4]
const x = [1, 2, 3].sort((a, b) => a - b)

export default function (): ReactNode {
  // const k = new KnapsackResolver()
  // const [used, unused] = k.resolve(250, x)
  // const [used, unused] = resolveKnapsack(250, x)
  // return (
  //   <View className={c(SandboxStyle.NORMAL, styles.container)}>
  //     <View>
  //       <span>Sum: {new NumericDataSet(used).sum}</span>
  //       <span>Used: {used.join(', ')}</span>
  //       <span>Unused: {unused.join(', ')}</span>
  //     </View>
  //   </View>
  // )
  const timeStart = performance.now()
  const { sum, usedItems, unusedItems } = resolveNumericKnapsack(250, x)
  const timeElapsed = performance.now() - timeStart
  return (
    <SandboxContent className={styles.container}>
      <View>
        <span>Sum: {sum}</span>
        <span>Used: {usedItems.join(' + ')}</span>
        <span>Unused: {unusedItems.join(' + ')}</span>
        <span>Time elapsed: {timeElapsed}ms</span>
      </View>
    </SandboxContent>
  )
}

// iterate through each possible arrangement (ABC, ACB, BAC, BCA, CAB, CBA)
// for each iteration, get sum before capacity
// if the sum is larger than prev cached sum, then override value
// the time take to compute this increases exponentially as the number or items increases
// this will take almost forever for any dataset with more than 10 elements

function resolveNumericKnapsack(capacity: number, values: Array<number>): ISumBeforeCapacityResult {
  let lastResult: ISumBeforeCapacityResult = {
    sum: Number.MIN_SAFE_INTEGER,
    usedItems: [],
    unusedItems: [],
  }
  forEachPermutation(values, (permutedValues) => {
    const currentResult = getSumBeforeCapacity(capacity, permutedValues)
    // console.log(`${permutedValues.join('+')}=${currentResult.sum}`)
    if (currentResult.sum > lastResult.sum) {
      lastResult = currentResult
    }
  })
  return lastResult
}

function forEachPermutation<T>(items: Array<T>, callback: (items: Array<T>) => void) {
  permutate([], items, callback)
}

// permutate([], ['A', 'B', 'C'], (val) => { console.log(val.join(',')) })

function permutate<T>(prevItems: Array<T>, nextItems: Array<T>, callback: (items: Array<T>) => void) {
  for (let i = 0; i < Math.min(nextItems.length, 3); i++) {
    const subset = [...nextItems]
    const [target] = subset.splice(i, 1)
    const currentItems = [...prevItems, target]
    if (subset.length > 0) {
      permutate(currentItems, subset, callback)
    } else {
      callback(currentItems)
    }
  }
}

export interface ISumBeforeCapacityResult {
  sum: number
  usedItems: Array<number>
  unusedItems: Array<number>
}

function getSumBeforeCapacity(capacity: number, values: Array<number>): ISumBeforeCapacityResult {
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    if (sum + values[i] > capacity) {
      const unusedItems = [...values]
      const usedItems = unusedItems.splice(0, i)
      return { sum, usedItems, unusedItems }
    }
    sum += values[i]
  }
  return { sum, usedItems: values, unusedItems: [] }
}

export type KnapsackResult<T> = [usedItems: Array<T>, unusedItems: Array<T>]

export class KnapsackResolver<T = number> {

  private static DEFAULT_VALUE_EXTRACTOR<T>(item: T): number {
    return item as number
  }

  private readonly extractValue?: (item: T) => number

  constructor(valueExtractor?: typeof this.extractValue) {
    this.extractValue = valueExtractor ?? KnapsackResolver.DEFAULT_VALUE_EXTRACTOR
  }

  private sum(items: Array<T>): number {
    return items.reduce((sum, item) => sum + this.extractValue(item), 0)
  }

  resolve(capacity: number, items: Array<T>): KnapsackResult<T> {
    const usedItems: Array<T> = []
    const unusedItems: Array<T> = []
    const sortedItems = [...items].sort((a, b) => this.extractValue(a) - this.extractValue(b))
    let sumReached = false
    sortedItems.forEach((item) => {
      if (!sumReached && this.sum(usedItems) + this.extractValue(item) < capacity) {
        usedItems.push(item)
      } else {
        unusedItems.push(item)
        sumReached = true
      }
    })
    let prevDiff = capacity - this.sum(usedItems)
    for (let i = 0; i < unusedItems.length; i++) {
      const currentUnusedItem = unusedItems[i]
      const temp = KnapsackResolver.createPreviewOfNthItemSwapped(usedItems, currentUnusedItem)
      // TODO: start swapping from last item back one by one?
      const currentSum = this.sum(temp)
      const currentDiff = capacity - currentSum
      // console.log({ currentSum, currentDiff, prevDiff })
      if (currentDiff >= 0 && currentDiff < prevDiff) {
        prevDiff = currentDiff
        unusedItems[i] = usedItems[usedItems.length - 1]
        usedItems[usedItems.length - 1] = currentUnusedItem
      }
    }
    return [usedItems, unusedItems]
  }

  private static createPreviewOfNthItemSwapped<T>(items: Array<T>, itemToSwap: T) {
    const payload = [...items]
    payload.splice(items.length - 1, 1, itemToSwap)
    return payload
  }

  exhaustiveResolve(capacity: number, items: Array<T>): Array<KnapsackResult<T>> {
    return []
  }

}

export type OLD_KnapsackResult = [usedValues: Array<number>, unusedValues: Array<number>]

export function resolveKnapsack(capacity: number, values: Array<number>): OLD_KnapsackResult {
  const usedValues: Array<number> = []
  const unusedValues: Array<number> = []
  values = [...values].sort((a, b) => b - a)
  console.log(values)
  while (values.length > 0 && new NumericDataSet(usedValues).sum < capacity) {
    const currentValue = values.shift()
    if (new NumericDataSet(usedValues).sum + currentValue < capacity) {
      usedValues.push(currentValue)
    } else {
      unusedValues.push(currentValue)
    }
  }
  return [usedValues, unusedValues]
}
