import { createElement, Fragment } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'

export function reactStaticSanitizeHTMLString(value: string): string {
  const fragment = createElement(Fragment, undefined, value)
  return renderToStaticMarkup(fragment)
}

export function reactRootSanitizeHTMLString(value: string): string {
  const fragment = createElement(Fragment, undefined, value)
  const documentFragment = document.createDocumentFragment()
  const root = createRoot(documentFragment)
  flushSync(() => { root.render(fragment) })
  const payload = documentFragment.textContent
  flushSync(() => { root.unmount() })
  return payload
}
