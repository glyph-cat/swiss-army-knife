import { UrlSanitizer } from '.'

describe(UrlSanitizer.prototype.isAllowed.name, () => {

  describe('With contextual URL', () => {

    test('Well-known parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('fbclid', 'www.example.com')).toBeFalse()
      expect(isAllowed('igsh', 'www.example.com')).toBeFalse()
      expect(isAllowed('mibextid', 'www.example.com')).toBeFalse()
      expect(isAllowed('si', 'www.example.com')).toBeFalse()
      expect(isAllowed('s', 'www.twitter.com')).toBeFalse()
      expect(isAllowed('t', 'www.twitter.com')).toBeFalse()
      expect(isAllowed('s', 'www.x.com')).toBeFalse()
      expect(isAllowed('t', 'www.x.com')).toBeFalse()
    })

    test('Other generic parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('id', 'www.example.com')).toBeTrue()
      expect(isAllowed('ref_id', 'www.example.com')).toBeTrue()
      expect(isAllowed('user', 'www.example.com')).toBeTrue()
      expect(isAllowed('stage', 'www.example.com')).toBeTrue()
    })

  })

  describe('Without contextual URL', () => {

    test('Well-known parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('fbclid')).toBeFalse()
      expect(isAllowed('igsh')).toBeFalse()
      expect(isAllowed('mibextid')).toBeFalse()
      expect(isAllowed('si')).toBeFalse()
      expect(isAllowed('s')).toBeTrue()
      expect(isAllowed('t')).toBeTrue()
    })

    test('Other generic parameters', () => {
      const { isAllowed } = new UrlSanitizer()
      expect(isAllowed('id')).toBeTrue()
      expect(isAllowed('ref_id')).toBeTrue()
      expect(isAllowed('user')).toBeTrue()
      expect(isAllowed('stage')).toBeTrue()
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
