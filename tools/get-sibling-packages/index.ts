import { PACKAGES_DIRECTORY } from '../../scripts/constants'
import {
  getPackages,
  GetPackagesResult,
} from '../../src/packages/project-helpers/src/get-packages'

// NOTE: We need to import directly from the file because this tool is used by
// the auto-forward-exports script.

export function getSiblingPackages(): GetPackagesResult {
  return getPackages(PACKAGES_DIRECTORY, { excludePrivatePackages: true })
}
