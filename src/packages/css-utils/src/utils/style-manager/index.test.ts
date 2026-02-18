/** @jest-environment jsdom */
import { Nullable } from '@glyph-cat/foundation'
import { StyleManager } from '.'
import { DATA_PRECEDENCE_LEVEL, PrecedenceLevel } from '../add-styles/constants'

let styleManager: Nullable<StyleManager> = null
afterEach(() => {
  styleManager?.dispose()
  styleManager = null
})

test('No initial styles', () => {
  styleManager = new StyleManager()
  const styleElements = document.head.querySelectorAll('style')
  expect(styleElements.length).toBe(1)
  const styleElement = styleElements.item(0)
  expect(Object.is(styleManager.element, styleElement)).toBe(true)
  expect(styleElement.innerHTML).toBe('')
  expect(styleElement.getAttribute(DATA_PRECEDENCE_LEVEL)).toBe(String(PrecedenceLevel.HIGH))
})

test('With initial styles and custom precedence level', () => {
  styleManager = new StyleManager([
    ['.foo', { display: 'grid' }],
  ], PrecedenceLevel.LOW)
  const styleElements = document.head.querySelectorAll('style')
  expect(styleElements.length).toBe(1)
  const styleElement = styleElements.item(0)
  expect(Object.is(styleManager.element, styleElement)).toBe(true)
  expect(styleElement.innerHTML).toBe('.foo{display:grid}')
  expect(styleElement.getAttribute(DATA_PRECEDENCE_LEVEL)).toBe(String(PrecedenceLevel.LOW))
})

describe(StyleManager.prototype.set.name, () => {

  test('No initial styles from constructor', () => {
    styleManager = new StyleManager()
    styleManager.set('.bar', { color: 'gray' })
    expect(styleManager.element.innerHTML).toBe('.bar{color:gray}')
    styleManager.set('.baz', { color: 'red' })
    expect(styleManager.element.innerHTML).toBe('.bar{color:gray}.baz{color:red}')
  })

  test('With initial styles from constructor', () => {
    styleManager = new StyleManager([
      ['.foo', { display: 'grid' }],
    ])
    styleManager.set('.bar', { color: 'gray' })
    expect(styleManager.element.innerHTML).toBe('.foo{display:grid}.bar{color:gray}')
    styleManager.set('.baz', { color: 'red' })
    expect(styleManager.element.innerHTML).toBe('.foo{display:grid}.bar{color:gray}.baz{color:red}')
  })

})

test(StyleManager.prototype.delete.name, () => {
  styleManager = new StyleManager([
    ['.foo', { display: 'grid' }],
    ['.bar', { color: 'gray' }],
  ])
  expect(styleManager.element.innerHTML).toBe('.foo{display:grid}.bar{color:gray}')
  expect(styleManager.delete('.foo')).toBe(true)
  expect(styleManager.element.innerHTML).toBe('.bar{color:gray}')
  expect(styleManager.delete('.foo')).toBe(false)
  expect(styleManager.element.innerHTML).toBe('.bar{color:gray}')
})

test(StyleManager.prototype.clear.name, () => {
  styleManager = new StyleManager([
    ['.foo', { display: 'grid' }],
    ['.bar', { color: 'gray' }],
  ])
  styleManager.clear()
  expect(styleManager.element.innerHTML).toBe('')
})

test(StyleManager.prototype.dispose.name, () => {
  styleManager = new StyleManager()
  styleManager.dispose()
  styleManager.dispose() // Multiple invocation should not fail
  const styleElements = document.head.querySelectorAll('style')
  expect(styleElements.length).toBe(0)
})
