/**
 * Make text go uwu.
 * @param text - The text to UWU-ify.
 * @returns The UWU-ified text.
 * @example
 * uwu('Hello, please be my friend.')
 * // Hewwo, pwease be my fwiend.
 * @public
 */
export function uwu(text: string): string {
  return text.replace(/[lr]/g, 'w').replace(/[LR]/g, 'W')
}
