import { pickRandom } from '../../random/pick'

/**
 * @internal
 */
const LOREM_IPSUM_SOURCE = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum']

/**
 * Lorem ipsum text generator.
 * @param wordCount - The number of words to generate.
 * @returns A string of dummy text.
 * @public
 */
export function getLoremIpsum(wordCount: number): string {
  const paragraph = []
  while (paragraph.length < wordCount) {
    paragraph.push(pickRandom(LOREM_IPSUM_SOURCE))
  }
  return paragraph.join(' ')
}
