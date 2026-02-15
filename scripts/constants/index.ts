import path from 'path'
import {
  getProjectRootDirectory,
} from '../../src/packages/project-helpers/src/get-project-root-directory'

// NOTE: We need to import directly from the file because this tool is used by
// the auto-forward-exports script.

export const PACKAGES_DIRECTORIES = path.join(
  getProjectRootDirectory((path.sep === '/' ? '/' : '') + process.cwd()),
  'src',
  'packages',
)
