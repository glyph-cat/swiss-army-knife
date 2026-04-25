import {
  getPackages,
  GetPackagesResult,
} from '@glyph-cat/project-helpers/src/get-packages'
import { PACKAGES_DIRECTORY } from '../constants'

// NOTE: We need to import directly from the file because this tool is used by
// the auto-forward-exports script.

export function getSiblingPackages(): GetPackagesResult {
  return getPackages(PACKAGES_DIRECTORY, { excludePrivatePackages: true })
}
