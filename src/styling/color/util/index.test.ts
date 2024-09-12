import {
  getValuesFromHSLString,
  getValuesFromHexString,
  getValuesFromRGBString,
} from '.'

// Colors are obtained from https://www.color-hex.com/color-palette/19601
// #373b3e	rgb(55,59,62)
// #bec8d1	rgb(190,200,209)
// #86cecb	rgb(134,206,203)
// #137a7f	rgb(19,122,127)
// #e12885	rgb(225,40,133)

// todo: fix failing tests

describe(getValuesFromHSLString.name, () => {

  test('Happy path', () => {
    expect(getValuesFromHSLString('hsl(120deg 75% 25%)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      null, null,
    ])
  })

  test('With commas', () => {
    expect(getValuesFromHSLString('hsl(120deg, 75%, 25%)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      null, null,
    ])
  })

  test('Uppercase HSL', () => {
    expect(getValuesFromHSLString('HSL(120deg 75% 25%)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      null, null,
    ])
  })

  test('Uppercase HSL (inconsistent case and commas)', () => {
    expect(getValuesFromHSLString('hSl(120deg 75% , 25%)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      null, null,
    ])
  })

  test('HSLA', () => {
    expect(getValuesFromHSLString('hsla(120deg 75% 25%)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      null, null,
    ])
  })

  test('Without units', () => {
    expect(getValuesFromHSLString('hsl(120 75 25)')).toStrictEqual([
      120, '120',
      75, '75',
      25, '25',
      null, null,
    ])
  })

  test('With alpha (decimal)', () => {
    expect(getValuesFromHSLString('hsl(120deg 75% 25% / 0.6)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      0.6, '0.6',
    ])
  })

  test('With alpha (percentage)', () => {
    expect(getValuesFromHSLString('hsl(120deg 75% 25% / 60%)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      0.6, '60%',
    ])
  })

  test('With alpha delimited by slash', () => {
    expect(getValuesFromHSLString('hsl(120deg 75% 25% / 60%)')).toStrictEqual([
      120, '120deg',
      75, '75%',
      25, '25%',
      0.6, '60%',
    ])
  })

  test('Hue is \'none\'', () => {
    expect(getValuesFromHSLString('hsl(none 75% 25%)')).toStrictEqual([
      0, 'none',
      75, '75%',
      25, '25%',
      null, null,
    ])
  })

  test('Invalid values', () => {
    const invalidValues = [
      'hsl(19sbc, 50%, def)',
      'hsl(19 50)',
      'hsl(19, 50%, 75%, 39%, 0.1)',
      // Leading & trailing spaces not allowed:
      ' hsl(120deg 75% 25%) ',
      // Relative values not supported:
      'hsl(from green h s l / 0.5)',
      'hsl(from #0000FF h s calc(l + 20))',
      'hsl(from rgb(200 0 0) calc(h + 30) s calc(l + 30))',
    ]
    for (const value of invalidValues) {
      const fn = () => { getValuesFromRGBString(value) }
      expect(fn).toThrow(`Invalid RGB string '${value}'`)
    }
  })

})

describe(getValuesFromHexString.name, () => {

  describe('Valid values', () => {

    test('#xxx', () => {
      expect(getValuesFromHexString('#8cd')).toStrictEqual([
        0x88, '8',
        0xcc, 'c',
        0xdd, 'd',
        null, null,
      ])
    })

    test('#xxxx', () => {
      expect(getValuesFromHexString('#8cd5')).toStrictEqual([
        0x88, '8',
        0xcc, 'c',
        0xdd, 'd',
        0x55 / 255, '5',
      ])
    })

    test('#xxxxxx', () => {
      expect(getValuesFromHexString('#86cecb')).toStrictEqual([
        0x86, '86',
        0xce, 'ce',
        0xcb, 'cb',
        null, null,
      ])
    })

    test('#xxxxxxxx', () => {
      expect(getValuesFromHexString('#86cecb4a')).toStrictEqual([
        0x86, '86',
        0xce, 'ce',
        0xcb, 'cb',
        0x4a / 255, '4a',
      ])
    })

  })

  test('Invalid values', () => {
    const invalidValues = [
      '',
      '123abc',
      '#8',
      '#8c',
      '#8cd50',
      '#137a7f4',
      ' #137a7f ',
    ]
    for (const value of invalidValues) {
      const fn = () => { getValuesFromHexString(value) }
      expect(fn).toThrow(`Invalid hex code '${value}'`)
    }
  })

})

describe(getValuesFromRGBString.name, () => {

  test('Happy path', () => {
    expect(getValuesFromRGBString('rgb(19 122 127)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      null, null,
    ])
  })

  test('With commas', () => {
    expect(getValuesFromRGBString('rgb(19, 122, 127)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      null, null,
    ])
  })

  test('Uppercase RGB', () => {
    expect(getValuesFromRGBString('RGB(19 122 127)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      null, null,
    ])
  })

  test('Uppercase RGB (inconsistent case and commas)', () => {
    expect(getValuesFromRGBString('rGb(19 122, 127)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      null, null,
    ])
  })

  test('RGBA', () => {
    expect(getValuesFromRGBString('rgba(19 122 127)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      null, null,
    ])
  })

  test('With alpha (decimal)', () => {
    expect(getValuesFromRGBString('rgb(19 122 127 0.39)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      0.39, '0.39',
    ])
  })

  test('With alpha (percentage)', () => {
    expect(getValuesFromRGBString('rgb(19 122 127 39%)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      39, '39%',
    ])
  })

  test('With alpha (delimited by slash)', () => {
    expect(getValuesFromRGBString('rgb(19 122 127 / 39%)')).toStrictEqual([
      19, '19',
      122, '122',
      127, '127',
      39, '39%',
    ])
  })

  test('Invalid values', () => {
    const invalidValues = [
      'rgb(19, 122, abc)',
      'rgb(19,122)',
      'rgb(19, 122, 127, 39%, 0.1)',
      // Leading & trailing spaces not allowed:
      ' rgb(19 122 127) ',
      // Relative values not supported:
      'rgb(from green r g b / 0.5)',
      'rgb(from #0000FF calc(r + 40) calc(g + 40) b)',
      'rgb(from hwb(120deg 10% 20%) r g calc(b + 200))',
    ]
    for (const value of invalidValues) {
      const fn = () => { getValuesFromRGBString(value) }
      expect(fn).toThrow(`Invalid RGB string '${value}'`)
    }
  })

})
