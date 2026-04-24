import { em, fr, percent, pt, px, rem, vh, vmax, vmin, vw } from '.'

test(px.name, () => {
  expect(px(12)).toBe('12px')
})

test(pt.name, () => {
  expect(pt(12)).toBe('12pt')
})

test(em.name, () => {
  expect(em(12)).toBe('12em')
})

test(rem.name, () => {
  expect(rem(12)).toBe('12rem')
})

test(fr.name, () => {
  expect(fr(12)).toBe('12fr')
})

test(vh.name, () => {
  expect(vh(12)).toBe('12vh')
})

test(vw.name, () => {
  expect(vw(12)).toBe('12vw')
})

test(vmin.name, () => {
  expect(vmin(12)).toBe('12vmin')
})

test(vmax.name, () => {
  expect(vmax(12)).toBe('12vmax')
})

test(percent.name, () => {
  expect(percent(12)).toBe('12%')
})
