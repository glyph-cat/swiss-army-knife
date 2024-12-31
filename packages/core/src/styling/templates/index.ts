import { CleanupFunction } from '../../types'

/**
 * NOTE: Requires {@link loadTemplateStyles} to be called.
 * @public
 */
export enum TemplateStyles {
  HIDDEN = 'hidden',
}

// TODO: Mention in release notes
// TODO: Add `useTemplateStylesLoader` to 'react' package
/**
 * @public
 */
export function loadTemplateStyles(): CleanupFunction {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = process.env.CSS_CONTENT.TemplateStyles
  // TODO: Load text content of './index.module.css' as process env variable
  // https://www.npmjs.com/package/clean-css
  document.head.append(styleElement)
  return () => { styleElement.remove() }
}
