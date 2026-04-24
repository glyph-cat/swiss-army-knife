/**
 * @public
 */
export type PaginationSpecs = [
  indexStart: number,
  indexEnd: number,
]

/**
 * Determines the start and end indices of items to display in a paginated list.
 * @param pageIndex - The index of page being viewed (Eg: first page = `0`).
 * @param pageSize - The number of items to show per page.
 * @example
 * getPaginationSpecs(25, 2) // [50, 74]
 * @returns A tuple containing the start index and end index of items to display.
 * @public
 */
export function getPaginationSpecs(
  pageSize: number,
  pageIndex: number,
): PaginationSpecs {
  const indexStart = pageIndex * pageSize
  const indexEnd = ((pageIndex + 1) * pageSize) - 1
  return [indexStart, indexEnd]
}
