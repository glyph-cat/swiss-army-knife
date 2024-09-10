/**
 * Simple case conversion utility that only takes a limited range of characters
 * into consideration:
 * - Alphabets (A-Z, a-z)
 * - Numbers (0-9)
 * - Dashes (`-`)
 * - Underscores (`_`)
 * - Spaces (` `)
 *
 * Latin, Greek and Cyrillic characters are not taken into consideration.
 * @public
 */
export class Casing {

  static getWords(value: string): Array<string> {
    // Split by common delimiters
    const symbolDelimitedWords = value.split(/[\s_-]/g)
    // Split by numbers
    const numberDelimitedWords: Array<string> = []
    for (const word of symbolDelimitedWords) {
      numberDelimitedWords.push(...word.split(/(\d+)/g))
    }
    // Split by case-sensitive characters
    const caseDelimitedWords: Array<string> = []
    for (const word of numberDelimitedWords) {
      caseDelimitedWords.push(...word.split(/([A-Z][a-z]+)/g))
    }
    return caseDelimitedWords.filter((word) => !!word)
  }

  static capitalizeFirstLetter(
    value: string,
    forceLowerCaseOnOtherLetters = false,
  ): string {
    if (!value) { return '' } // Early exit
    const [firstLetter, ...remainingLetters] = value
    let concatenatedRemainingLetters = remainingLetters.join('')
    if (forceLowerCaseOnOtherLetters) {
      concatenatedRemainingLetters = concatenatedRemainingLetters.toLowerCase()
    }
    return `${firstLetter.toUpperCase()}${concatenatedRemainingLetters}`
  }

  readonly words: Array<string> = []

  constructor(readonly value: string) {
    this.words = Casing.getWords(value)
  }

  private isWordOriginatedFromMacroCase = (word: string): boolean => {
    if (word === this.value) { return true } // Early exit
    return new RegExp(`${word}_`).test(this.value) || new RegExp(`_${word}`).test(this.value)
  }

  /**
   * @example 'LoremIpsumDolorSitAmet'
   */
  toPascalCase(): string {
    let output = ''
    for (let i = 0; i < this.words.length; i++) {
      output += Casing.capitalizeFirstLetter(
        this.words[i],
        this.isWordOriginatedFromMacroCase(this.words[i]),
      )
    }
    return output
  }

  /**
   * @example 'loremIpsumDolorSitAmet'
   */
  toCamelCase(): string {
    const pascalCaseOutput = this.toPascalCase()
    return (pascalCaseOutput[0]?.toLowerCase() ?? '') + pascalCaseOutput.substring(1, pascalCaseOutput.length)
  }

  /**
   * @example 'LOREM_IPSUM_DOLOR_SIT_AMET'
   */
  toMacroCase(): string {
    return this.words.join('_').toUpperCase()
  }

  /**
   * @example 'lorem_ipsum_dolor_sit_amet'
   */
  toSnakeCase(): string {
    return this.words.join('_').toLowerCase()
  }

  /**
   * @example 'lorem-ipsum-dolor-sit-amet'
   */
  toKebabCase(): string {
    return this.words.join('-').toLowerCase()
  }

  /**
   * @example 'Lorem Ipsum Dolor Sit Amet'
   */
  toTitleCase(): string {
    const preOutput: Array<string> = []
    for (let i = 0; i < this.words.length; i++) {
      preOutput.push(Casing.capitalizeFirstLetter(this.words[i]))
    }
    return preOutput.join(' ')
  }

  /**
   * @example 'LoReM IpSuM DoLoR SiT AmEt'
   */
  toSpongeCase(options: SpongeCaseOptions = {}): string {
    const concatenatedWords = options?.useOriginalString ? this.value : this.words.join(' ')
    let output = ''
    for (let i = 0; i < concatenatedWords.length; i++) {
      output += (options?.startWithUpperCase ? (i % 2 !== 0) : (i % 2 === 0))
        ? concatenatedWords[i].toLowerCase()
        : concatenatedWords[i].toUpperCase()
    }
    return output
  }

}

/**
 * @public
 */
export interface SpongeCaseOptions {
  /**
   * @defaultValue `false`
   */
  useOriginalString?: boolean
  /**
   * @defaultValue `false`
   */
  startWithUpperCase?: boolean
}
