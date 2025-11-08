/**
 * @public
 */
export class UrlSanitizer {

  constructor() {
    this.isAllowed = this.isAllowed.bind(this)
    this.sanitizeURL = this.sanitizeURL.bind(this)
  }

  /**
   * Checks if a parameter is allowed based on its name.
   * @param parameter - The name of parameter.
   * @param url - The contextual URL.
   * @returns `true` if the parameter is allowed (takes `url` into consideration if provided).
   */
  isAllowed(parameter: string, url?: string): boolean {
    if (UTM_PATTERN.test(parameter)) {
      return false // Early exit
    }
    parameter = parameter.toLowerCase()
    if (KNOWN_COMMON_PARAMETERS.has(parameter)) {
      return false // Early exit
    }
    if (url && X_PATTERN.test(url)) {
      if (KNOWN_X_PARAMETERS.has(parameter)) {
        return false // Early exit
      }
    }
    return true
  }

  /**
   * Sanitizes a URL.
   * @param value - The URL to sanitize.
   * @returns The sanitized URL.
   */
  sanitizeURL(value: string): string {
    const queryMarker = '?'
    const [url, query] = value.split(queryMarker)
    if (!query) { return url } // Early exit
    const paramSeparator = '&'
    const params = query.split(paramSeparator)
    const filteredParams = params.filter((param) => {
      const [key] = param.split('=')
      return this.isAllowed(key, url)
    })
    if (filteredParams.length <= 0) { return url } // Early exit
    return `${url}${queryMarker}${filteredParams.join(paramSeparator)}`
  }

}

const UTM_PATTERN = /^utm_/i
const X_PATTERN = /\.(twitter|x)\.com/i

const KNOWN_COMMON_PARAMETERS: ReadonlySet<string> = new Set<string>([
  'fbclid', // Used by Facebook
  'igsh', // Used by Instagram
  'mibextid', // Used by Facebook
  'si', // Used by YouTube
])

const KNOWN_X_PARAMETERS: ReadonlySet<string> = new Set<string>([
  's',
  't',
])
