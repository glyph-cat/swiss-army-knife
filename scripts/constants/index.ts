import path from 'path'
import {
  getProjectRootDirectory,
} from '../../src/packages/project-helpers/src/get-project-root-directory'

// NOTE: We need to import directly from the file because this tool is used by
// the auto-forward-exports script.

export const PROJECT_ROOT_DIRECTORY: string = (() => {
  const cwd = process.cwd()
  const payload = getProjectRootDirectory((path.sep === '/' ? '/' : '') + cwd)
  if (!payload) {
    throw new Error(`Failed to determine project root directory from: "${cwd}"`)
  }
  return payload
})()

export const PACKAGES_DIRECTORY = path.join(
  PROJECT_ROOT_DIRECTORY,
  'src',
  'packages',
)
