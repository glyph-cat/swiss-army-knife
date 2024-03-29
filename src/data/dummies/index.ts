import { pickRandom } from '../../random/pick'

/**
 * An empty function to be passed as a parameter or component prop in case there
 * is nothing to do but it is a required parameter/prop.
 * @example
 * // Just an example, of course, if you want to control the availability of a
 * // button you don't really need to do this.
 * React.createElement('button', {
 *   onClick: enabled ? onButtonClick : EMPTY_FUNCTION,
 * })
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const EMPTY_FUNCTION = (): void => { }

/**
 * An empty object that can be passed around and used as a reference where
 * necessary.
 * @example
 * let lazyVariable = EMPTY_OBJECT
 * // ...
 * if (Object.is(lazyVariable, EMPTY_OBJECT)) {
 *   lazyVariable = someValue
 * }
 * @public
 */
export const EMPTY_OBJECT: Record<never, never> = {}

/**
 * @internal
 */
const LOREM_IPSUM_SOURCE = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum']

/**
 * Lorem ipsum text generator.
 * @param wordCount - The number of words to generate.
 * @returns A string of dummy text.
 */
export function getLoremIpsum(wordCount: number): string {
  const paragraph = []
  while (paragraph.length < wordCount) {
    paragraph.push(pickRandom(LOREM_IPSUM_SOURCE))
  }
  return paragraph.join(' ')
}
