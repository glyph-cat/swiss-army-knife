import { Nullable } from '../../data'

/**
 * @public
 */
export type PaperSingleSideLayout = [left: Nullable<number>, right: Nullable<number>]

/**
 * @public
 */
export type PaperDoubleSideLayout = [front: PaperSingleSideLayout, back: PaperSingleSideLayout]

/**
 * Calculates the page layout order for a book.
 * @public
 * @returns An array of `PaperDoubleSideLayout` where the size of the array also
 * indicates the number of papers required.
 */
export function getPageLayoutOrder(pageCount: number): Array<PaperDoubleSideLayout> {

  const papersNeeded = Math.ceil(pageCount / 4)
  const paperStack: Array<PaperDoubleSideLayout> = []
  const paddedPageCount = papersNeeded * 4

  /**
   * @returns `val` as-is if it is within the specified `pageCount`,
   * otherwise `null` to indicate that it should be a blank page.
   */
  const enforceRange = (val: number): Nullable<number> => val <= pageCount ? val : null

  for (let i = 0; i < papersNeeded; i++) {
    const frontRight = enforceRange((i + 1) + (1 * i)) // Relative page 1
    const backLeft = enforceRange(frontRight + 1) // Relative page 2
    const backRight = enforceRange(paddedPageCount - frontRight) // Relative page 3
    const frontLeft = enforceRange(paddedPageCount - frontRight + 1) // Relative page 4
    paperStack.push([[frontLeft, frontRight], [backLeft, backRight]])
  }

  return paperStack

}
