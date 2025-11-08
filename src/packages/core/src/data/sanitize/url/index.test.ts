import { UrlSanitizer } from '.'

describe(UrlSanitizer.prototype.isAllowed.name, () => {

  describe('With contextual URL', () => {

    test('Well-known parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('fbclid', 'www.example.com')).toBe(false)
      expect(isAllowed('igsh', 'www.example.com')).toBe(false)
      expect(isAllowed('mibextid', 'www.example.com')).toBe(false)
      expect(isAllowed('si', 'www.example.com')).toBe(false)
      expect(isAllowed('s', 'www.twitter.com')).toBe(false)
      expect(isAllowed('t', 'www.twitter.com')).toBe(false)
      expect(isAllowed('s', 'www.x.com')).toBe(false)
      expect(isAllowed('t', 'www.x.com')).toBe(false)
    })

    test('Other generic parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('id', 'www.example.com')).toBe(true)
      expect(isAllowed('ref_id', 'www.example.com')).toBe(true)
      expect(isAllowed('user', 'www.example.com')).toBe(true)
      expect(isAllowed('stage', 'www.example.com')).toBe(true)
    })

  })

  describe('Without contextual URL', () => {

    test('Well-known parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('fbclid')).toBe(false)
      expect(isAllowed('igsh')).toBe(false)
      expect(isAllowed('mibextid')).toBe(false)
      expect(isAllowed('si')).toBe(false)
      expect(isAllowed('s')).toBe(true)
      expect(isAllowed('t')).toBe(true)
    })

    test('Other generic parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('id')).toBe(true)
      expect(isAllowed('ref_id')).toBe(true)
      expect(isAllowed('user')).toBe(true)
      expect(isAllowed('stage')).toBe(true)
    })

  })

})

describe(UrlSanitizer.prototype.sanitizeURL.name, () => {

  describe('Disallowed parameters only', () => {

    test('1 parameter only', () => {
      const { sanitizeURL } = new UrlSanitizer()
      const output = sanitizeURL('https://www.example.com?fbclid=abc')
      expect(output).toBe('https://www.example.com')
    })

    describe('Multiple parameters', () => {

      test('All unique', () => {
        const { sanitizeURL } = new UrlSanitizer()
        const output = sanitizeURL('https://www.example.com?fbclid=abc&si=def')
        expect(output).toBe('https://www.example.com')
      })

      test('Some repeating', () => {
        const { sanitizeURL } = new UrlSanitizer()
        const output = sanitizeURL('https://www.example.com?fbclid=abc&si=def&fbclid=ghi')
        expect(output).toBe('https://www.example.com')
      })

    })

  })

  describe('No disallowed parameters', () => {

    test('1 parameter only', () => {
      const { sanitizeURL } = new UrlSanitizer()
      const output = sanitizeURL('https://www.example.com?id=1')
      expect(output).toBe('https://www.example.com?id=1')
    })

    describe('Multiple parameters', () => {

      test('All unique', () => {
        const { sanitizeURL } = new UrlSanitizer()
        const output = sanitizeURL('https://www.example.com?id=1&ref=2')
        expect(output).toBe('https://www.example.com?id=1&ref=2')
      })

      test('Some repeating', () => {
        const { sanitizeURL } = new UrlSanitizer()
        const output = sanitizeURL('https://www.example.com?id=1&ref=2&id=3')
        expect(output).toBe('https://www.example.com?id=1&ref=2&id=3')
      })

    })

  })

  describe('Mixed parameters', () => {

    test('All unique', () => {
      const { sanitizeURL } = new UrlSanitizer()
      const output = sanitizeURL('https://www.example.com?id=1&fbclid=abc')
      expect(output).toBe('https://www.example.com?id=1')
    })

    test('Some repeating', () => {
      const { sanitizeURL } = new UrlSanitizer()
      const output = sanitizeURL('https://www.example.com?id=1&fbclid=abc&id=2&utm_source=xyz&fbclid=def')
      expect(output).toBe('https://www.example.com?id=1&id=2')
    })

  })

  describe('No parameters', () => {

    test('With trailing "?"', () => {
      const { sanitizeURL } = new UrlSanitizer()
      expect(sanitizeURL('https://www.example.com?')).toBe('https://www.example.com')
    })

    test('Without trailing "?"', () => {
      const { sanitizeURL } = new UrlSanitizer()
      expect(sanitizeURL('https://www.example.com')).toBe('https://www.example.com')
    })

  })

  test('Empty string', () => {
    const { sanitizeURL } = new UrlSanitizer()
    expect(sanitizeURL('')).toBe('')
  })

})
