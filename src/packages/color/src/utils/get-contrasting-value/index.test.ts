import { getContrastingValue, prepareContrastingValue } from '.'

test(getContrastingValue.name, () => {
  expect(getContrastingValue('#115522', '#000000', '#FFFFFF')).toBe('#FFFFFF')
  expect(getContrastingValue('#AACCFF', '#000000', '#FFFFFF')).toBe('#000000')
})

test(prepareContrastingValue.name, () => {
  const getColorForBg = prepareContrastingValue({
    light: '#000000',
    dark: '#FFFFFF',
  })
  expect(getColorForBg('#115522')).toBe('#FFFFFF')
  expect(getColorForBg('#AACCFF')).toBe('#000000')
})
