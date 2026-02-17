/** @jest-environment jsdom */
import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { createRef } from '@glyph-cat/foundation'
import { addStyles } from '.'
import { StyleMap } from '../style-map'
import {
  DATA_PRECEDENCE_LEVEL,
  PrecedenceLevel,
  QUERY_SELECTOR_PRECEDENCE_LEVEL_INTERNAL,
  QUERY_SELECTOR_PRECEDENCE_LEVEL_LOW,
} from './constants'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

beforeEach(() => { document.head.innerHTML = '' })
afterEach(() => { document.head.innerHTML = '' })

let mockCounter = 0

function createMockStyles(): string {
  return new StyleMap([
    [`mockStyle${++mockCounter}`, { color: '#ffffff' }],
  ]).compile()
}

const DATA_TEST_MARKER = 'data-test-marker'

/**
 * This is not required as part of the library so it is declared in the test file instead.
 */
const QUERY_SELECTOR_PRECEDENCE_LEVEL_HIGH = `style[${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.HIGH}"]`

const QUERY_SELECTOR_ANY_STYLE_ELEMENT = [
  'style',
  'link[rel="stylesheet"]',
  'link[rel="preload"][as="style"]',
].join(',')

function TestGroupFor(precedenceLevel: PrecedenceLevel): string {
  return `PrecedenceLevel.${PrecedenceLevel[precedenceLevel]}`
}

/**
 * Objectives:
 * - Style element should be removed when cleanup function is called.
 * - Precedence should default to `.HIGH` when not specified.
 */
test('Happy Path', () => {
  const mockStyles = createMockStyles()
  const removeStyles = addStyles(mockStyles)
  expect(document.head.querySelector(QUERY_SELECTOR_PRECEDENCE_LEVEL_HIGH)).not.toBeNull()
  removeStyles()
  expect(document.head.querySelector(QUERY_SELECTOR_PRECEDENCE_LEVEL_HIGH)).toBeNull()
})

test('Ref object should be assigned when added; and unassigned when removed', () => {
  const refObject = createRef<HTMLStyleElement>(null)
  const mockStyles = createMockStyles()
  const removeStyles = addStyles(mockStyles, null, refObject)
  expect(refObject.current).not.toBeNull()
  removeStyles()
  expect(refObject.current).toBeNull()
})

describe(TestGroupFor(PrecedenceLevel.HIGH), () => {

  test('Has style elements', () => {
    document.head.innerHTML = `
      <style ${DATA_TEST_MARKER}="a" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.INTERNAL}">.foo{}</style>
      <style ${DATA_TEST_MARKER}="b" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.LOW}">.bar{}</style>
      <style ${DATA_TEST_MARKER}="c">.baz{}</style>
      <link ${DATA_TEST_MARKER}="d" rel='stylesheet' href='styles.css' />
      <!-- Styles should be added here -->
    `
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.HIGH))
    const allStyleElements = document.head.querySelectorAll(QUERY_SELECTOR_ANY_STYLE_ELEMENT)
    expect(allStyleElements[0].getAttribute(DATA_TEST_MARKER)).toBe('a')
    expect(allStyleElements[1].getAttribute(DATA_TEST_MARKER)).toBe('b')
    expect(allStyleElements[2].getAttribute(DATA_TEST_MARKER)).toBe('c')
    expect(allStyleElements[3].getAttribute(DATA_TEST_MARKER)).toBe('d')
    expect(allStyleElements[4].innerHTML).toBe(mockStyles)
  })

  test('Has no style elements', () => {
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.HIGH))
    const element = document.head.querySelector(QUERY_SELECTOR_PRECEDENCE_LEVEL_HIGH)
    expect(element.innerHTML).toBe(mockStyles)
  })

})

describe(TestGroupFor(PrecedenceLevel.LOW), () => {

  test('Has low precedence style elements', () => {
    document.head.innerHTML = `
      <style ${DATA_TEST_MARKER}="a" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.INTERNAL}">.foo{}</style>
      <style ${DATA_TEST_MARKER}="b" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.LOW}">.bar{}</style>
      <!-- Styles should be added here -->
      <style ${DATA_TEST_MARKER}="c" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.HIGH}">.baz{}</style>
      <style ${DATA_TEST_MARKER}="d">.baz{}</style>
      <link ${DATA_TEST_MARKER}="e" rel='stylesheet' href='styles.css' />
    `
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.LOW))
    const allStyleElements = document.head.querySelectorAll(QUERY_SELECTOR_ANY_STYLE_ELEMENT)
    expect(allStyleElements[0].getAttribute(DATA_TEST_MARKER)).toBe('a')
    expect(allStyleElements[1].getAttribute(DATA_TEST_MARKER)).toBe('b')
    expect(allStyleElements[2].innerHTML).toBe(mockStyles)
    expect(allStyleElements[3].getAttribute(DATA_TEST_MARKER)).toBe('c')
    expect(allStyleElements[4].getAttribute(DATA_TEST_MARKER)).toBe('d')
    expect(allStyleElements[5].getAttribute(DATA_TEST_MARKER)).toBe('e')
  })

  test('Has no low precedence style elements, but has other precedence and unmanaged style elements', () => {
    document.head.innerHTML = `
      <style ${DATA_TEST_MARKER}="a" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.INTERNAL}">.foo{}</style>
      <!-- Styles should be added here -->
      <style ${DATA_TEST_MARKER}="b" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.HIGH}">.baz{}</style>
      <style ${DATA_TEST_MARKER}="c">.baz{}</style>
      <link ${DATA_TEST_MARKER}="d" rel='stylesheet' href='styles.css' />
    `
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.LOW))
    const allStyleElements = document.head.querySelectorAll(QUERY_SELECTOR_ANY_STYLE_ELEMENT)
    expect(allStyleElements[0].getAttribute(DATA_TEST_MARKER)).toBe('a')
    expect(allStyleElements[1].innerHTML).toBe(mockStyles)
    expect(allStyleElements[2].getAttribute(DATA_TEST_MARKER)).toBe('b')
    expect(allStyleElements[3].getAttribute(DATA_TEST_MARKER)).toBe('c')
    expect(allStyleElements[4].getAttribute(DATA_TEST_MARKER)).toBe('d')
  })

  test('Has no style elements', () => {
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.LOW))
    const element = document.head.querySelector(QUERY_SELECTOR_PRECEDENCE_LEVEL_LOW)
    expect(element.innerHTML).toBe(mockStyles)
  })

})

describe(TestGroupFor(PrecedenceLevel.INTERNAL), () => {

  test('Has internal precedence style elements', () => {
    document.head.innerHTML = `
      <style ${DATA_TEST_MARKER}="a" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.INTERNAL}">.foo{}</style>
      <!-- Styles should be added here -->
      <style ${DATA_TEST_MARKER}="b" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.LOW}">.bar{}</style>
      <style ${DATA_TEST_MARKER}="c" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.HIGH}">.baz{}</style>
      <style ${DATA_TEST_MARKER}="d">.baz{}</style>
      <link ${DATA_TEST_MARKER}="e" rel='stylesheet' href='styles.css' />
    `
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.INTERNAL))
    const allStyleElements = document.head.querySelectorAll(QUERY_SELECTOR_ANY_STYLE_ELEMENT)
    expect(allStyleElements[0].getAttribute(DATA_TEST_MARKER)).toBe('a')
    expect(allStyleElements[1].innerHTML).toBe(mockStyles)
    expect(allStyleElements[2].getAttribute(DATA_TEST_MARKER)).toBe('b')
    expect(allStyleElements[3].getAttribute(DATA_TEST_MARKER)).toBe('c')
    expect(allStyleElements[4].getAttribute(DATA_TEST_MARKER)).toBe('d')
    expect(allStyleElements[5].getAttribute(DATA_TEST_MARKER)).toBe('e')
  })

  // has no internal style, but have low and high level styles only, should add before it
  test('Has no internal precedence style elements, but has other precedence and unmanaged style elements', () => {
    document.head.innerHTML = `
      <!-- Styles should be added here -->
      <style ${DATA_TEST_MARKER}="a" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.LOW}">.foo{}</style>
      <style ${DATA_TEST_MARKER}="b" ${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.HIGH}">.baz{}</style>
      <style ${DATA_TEST_MARKER}="c">.baz{}</style>
      <link ${DATA_TEST_MARKER}="d" rel='stylesheet' href='styles.css' />
    `
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.INTERNAL))
    const allStyleElements = document.head.querySelectorAll(QUERY_SELECTOR_ANY_STYLE_ELEMENT)
    expect(allStyleElements[0].innerHTML).toBe(mockStyles)
    expect(allStyleElements[1].getAttribute(DATA_TEST_MARKER)).toBe('a')
    expect(allStyleElements[2].getAttribute(DATA_TEST_MARKER)).toBe('b')
    expect(allStyleElements[3].getAttribute(DATA_TEST_MARKER)).toBe('c')
    expect(allStyleElements[4].getAttribute(DATA_TEST_MARKER)).toBe('d')
  })

  test('Has no style elements', () => {
    const mockStyles = createMockStyles()
    cleanupManager.append(addStyles(mockStyles, PrecedenceLevel.INTERNAL))
    const element = document.head.querySelector(QUERY_SELECTOR_PRECEDENCE_LEVEL_INTERNAL)
    expect(element.innerHTML).toBe(mockStyles)
  })

})
