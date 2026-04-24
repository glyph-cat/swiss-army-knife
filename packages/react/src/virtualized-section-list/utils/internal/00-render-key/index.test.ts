import { getRenderKey } from '.'
import { CellType } from '../../../abstractions'

test(getRenderKey.name, () => {
  expect(getRenderKey(CellType.ITEM, 'x')).toBe('1:x')
  expect(getRenderKey(CellType.ITEM_SEPARATOR, 'x')).toBe('2:x')
  expect(getRenderKey(CellType.SECTION_HEADER, 'x')).toBe('3:x')
  expect(getRenderKey(CellType.SECTION_FOOTER, 'x')).toBe('4:x')
})
