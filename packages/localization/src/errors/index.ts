/**
 * @public
 */
export class LanguageNotFoundError extends Error {

  constructor(language: string) {
    super(`Language "${language}" could not be found in the dictionary`)
  }

}

/**
 * @public
 */
export class LocalizationKeyNotFoundError extends Error {

  constructor(key: string, language?: string) {
    super(
      `Localization key "${key}" could not be found in the dictionary` +
      (language ? ` for language "${language}"` : '')
    )
  }

}
