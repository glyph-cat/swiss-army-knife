import { mapPropertyNameFromJSToCSS } from '.'

test(mapPropertyNameFromJSToCSS.name, () => {
  expect(mapPropertyNameFromJSToCSS('backgroundColor')).toBe('background-color')
  expect(mapPropertyNameFromJSToCSS('opacity')).toBe('opacity')
  expect(mapPropertyNameFromJSToCSS('MozAnimation')).toBe('-moz-animation')
  expect(mapPropertyNameFromJSToCSS('WebkitAnimation')).toBe('-webkit-animation')
  expect(mapPropertyNameFromJSToCSS('msTransition')).toBe('-ms-transition')
  expect(mapPropertyNameFromJSToCSS('OAnimation')).toBe('-o-animation')
  expect(mapPropertyNameFromJSToCSS('--customVariable')).toBe('--customVariable')
})
