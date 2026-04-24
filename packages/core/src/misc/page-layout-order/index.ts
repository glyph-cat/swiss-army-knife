import { Nullable } from '@glyph-cat/foundation'

/**
 * @public
 */
export type PrintPaperSingleSideLayout = [left: Nullable<number>, right: Nullable<number>]

/**
 * @public
 */
export type PrintPaperDoubleSideLayout = [front: PrintPaperSingleSideLayout, back: PrintPaperSingleSideLayout]

/**
 * Calculates the page layout order for a book.
 * @public
 * @returns An array of `PaperDoubleSideLayout` where the size of the array also
 * indicates the number of papers required.
 */
export function getPrintPageLayoutOrder(pageCount: number): Array<PrintPaperDoubleSideLayout> {

  const papersNeeded = Math.ceil(pageCount / 4)
  const paperStack: Array<PrintPaperDoubleSideLayout> = []
  const paddedPageCount = papersNeeded * 4

  /**
   * @returns `val` as-is if it is within the specified `pageCount`,
   * otherwise `null` to indicate that it should be a blank page.
   */
  const enforceRange = (val: number): Nullable<number> => val <= pageCount ? val : null

  for (let i = 0; i < papersNeeded; i++) {
    const frontRight = enforceRange((i + 1) + (1 * i)) // Relative page 1
    const backLeft = frontRight ? enforceRange(frontRight + 1) : null// Relative page 2
    const backRight = frontRight ? enforceRange(paddedPageCount - frontRight) : null// Relative page 3
    const frontLeft = frontRight ? enforceRange(paddedPageCount - frontRight + 1) : null// Relative page 4
    paperStack.push([[frontLeft, frontRight], [backLeft, backRight]])
  }

  return paperStack

}
