function $normalizeValues(values: [Array<number>] | Array<number>): Array<number> {
  return Array.isArray(values[0]) ? values[0] : values as Array<number>
}

function $getSum(values: Array<number>): number {
  return values.reduce((sum, value) => {
    return sum + value
  }, 0)
}

/**
 * @public
 */
export function getSum(...values: [Array<number>] | Array<number>): number {
  return $getSum($normalizeValues(values))
}

function $getAverage(values: Array<number>): number {
  return $getSum(values) / values.length
}

/**
 * @public
 */
export function getAverage(...values: [Array<number>] | Array<number>): number {
  return $getAverage($normalizeValues(values))
}

/**
 * @public
 */
export function getMedian(...values: [Array<number>] | Array<number>): number {
  const normalizedValues = $normalizeValues(values)
  if (normalizedValues.length % 2 !== 0) {
    // NOTE: `Math.floor` is used instead of `Math.ceil` because array indices
    // are zero-based.
    return normalizedValues[Math.floor(normalizedValues.length / 2)]
  } else {
    const halfLength = normalizedValues.length / 2
    // NOTE: Normally it would be `(n÷2)` and `(n÷2)+1`, but because
    // array indices are zero-based, it becomes `(n÷2)-1` and `(n÷2)`
    return (normalizedValues[halfLength - 1] + normalizedValues[halfLength]) / 2
  }
}

/**
 * @public
 */
export function getVariance(...values: [Array<number>] | Array<number>): number {
  const normalizedValues = $normalizeValues(values)
  const differenceOfSumAndMeanSquared = normalizedValues.reduce((acc, value) => {
    return acc + Math.pow(value - $getAverage(normalizedValues), 2)
  }, 0)
  return differenceOfSumAndMeanSquared / (normalizedValues.length - 1)
}

/**
 * @public
 */
export function getVarianceForPopulation(...values: [Array<number>] | Array<number>): number {
  const normalizedValues = $normalizeValues(values)
  const differenceOfSumAndMeanSquared = normalizedValues.reduce((acc, value) => {
    return acc + Math.pow(value - $getAverage(normalizedValues), 2)
  }, 0)
  return differenceOfSumAndMeanSquared / normalizedValues.length
}

/**
 * @public
 */
export function getStdDev(...values: [Array<number>] | Array<number>): number {
  return Math.sqrt(getVariance(...values))
}

/**
 * @public
 */
export function getStdDevForPopulation(...values: [Array<number>] | Array<number>): number {
  return Math.sqrt(getVarianceForPopulation(...values))
}
