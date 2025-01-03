import { CleanupFunction } from '../../types'

/**
 * @public
 */
export function loadTemplateStyles(): CleanupFunction {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = process.env.CSS_CONTENT.TemplateStyles
  // https://www.npmjs.com/package/clean-css
  document.head.append(styleElement)
  return () => { styleElement.remove() }
}

export * from './abstractions.scripted'
