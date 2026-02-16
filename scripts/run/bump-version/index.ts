import chalk from 'chalk'
import { execSync } from 'child_process'
import path from 'path'
import { PackageJson } from 'type-fest'
import { objectFilter } from '../../../src/packages/core/src/data'
import { Encoding } from '../../../src/packages/foundation/src/encoding'
import { mutatePackageJson } from '../../../src/packages/project-helpers/src/mutate-package-json'
import { setDependencyVersion } from '../../../src/packages/project-helpers/src/set-dependency-version'
import { getSiblingPackages } from '../../../tools/get-sibling-packages'
import { PACKAGES_DIRECTORY } from '../../constants'

// What this script does:
// Bumps the versions of the root package along with its sub-packages.

function run(newVersion: string): void {

  if (!newVersion) {
    console.log(chalk.redBright(`Missing \`newVersion\``))
    process.exit(1)
  }

  if (!/^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/.test(newVersion)) {
    console.log(chalk.redBright(`\`newVersion\` is invalid: "${newVersion}"`))
    process.exit(1)
  }

  const gitStatusOutput = execSync('git status --porcelain', {
    encoding: Encoding.UTF_8,
  }).trim()

  if (gitStatusOutput) {
    console.log(chalk.redBright('Cannot bump version when there are uncommitted git changes'))
    process.exit(1)
  }

  mutatePackageJson('.', (pkg) => ({
    ...pkg,
    version: newVersion,
  } as PackageJson))

  const foundationPackageJson = mutatePackageJson(
    path.join(PACKAGES_DIRECTORY, 'foundation'),
    (pkg) => ({
      ...pkg,
      version: newVersion,
    } as PackageJson),
  )

  const corePackageJson = mutatePackageJson(
    path.join(PACKAGES_DIRECTORY, 'core'),
    (pkg) => ({
      ...pkg,
      version: newVersion,
      peerDependencies: {
        ...pkg.peerDependencies,
        [foundationPackageJson.name!]: newVersion,
      },
    } as PackageJson),
  )

  const reactPackageJson = mutatePackageJson(
    path.join(PACKAGES_DIRECTORY, 'react'),
    (pkg) => ({
      ...pkg,
      version: newVersion,
      peerDependencies: {
        ...pkg.peerDependencies,
        [foundationPackageJson.name!]: newVersion,
        [corePackageJson.name!]: newVersion,
      },
    } as PackageJson),
  )

  const essentialPackages = new Set([
    foundationPackageJson.name!,
    corePackageJson.name!,
    reactPackageJson.name!,
  ])
  const otherSiblingPackages = objectFilter(
    getSiblingPackages(),
    (packageName) => !essentialPackages.has(packageName),
  )
  console.log('otherSiblingPackages', otherSiblingPackages)

  Object.entries(otherSiblingPackages).forEach(([packageDirectory, packageName]) => {
    mutatePackageJson(path.join(PACKAGES_DIRECTORY, packageDirectory), (pkg) => {
      return setDependencyVersion(pkg, packageName!, newVersion)
    })
  })

  process.exit(1) // Script is not yet complete
  // execSync([
  //   'git add .',
  //   `git commit -m 'v${newVersion}'`,
  //   `git tag 'v${newVersion}'`,
  // ].join(' && '))

}

run(process.argv[2])
