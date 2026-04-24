import { formatName } from '.'

test(formatName.name, () => {
  const output = formatName('custom')
  expect(output).toBe('@glyph-cat/eslint-config (custom)')
})
