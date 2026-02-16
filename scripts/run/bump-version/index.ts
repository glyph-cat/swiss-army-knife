import chalk from 'chalk'
import { execSync } from 'child_process'
import path from 'path'
import readline from 'readline'
import { PackageJson } from 'type-fest'
import { objectFilter } from '../../../src/packages/core/src/data'
import { Encoding } from '../../../src/packages/foundation/src/encoding'
import { mutatePackageJson } from '../../../src/packages/project-helpers/src/mutate-package-json'
import { readPackageJson } from '../../../src/packages/project-helpers/src/read-package-json'
import { setDependencyVersion } from '../../../src/packages/project-helpers/src/set-dependency-version'
import { getSiblingPackages } from '../../../tools/get-sibling-packages'
import { PACKAGES_DIRECTORY, PROJECT_ROOT_DIRECTORY } from '../../constants'

// What this script does:
// Bumps the versions of the root package along with its sub-packages.

async function run(...args: Array<string>): Promise<void> {

  const ESSENTIALS = 'essentials'
  const allSiblingPackages = getSiblingPackages()

  const essentialPackagesNames: ReadonlyArray<string> = [
    '@glyph-cat/foundation',
    '@glyph-cat/swiss-army-knife',
    '@glyph-cat/swiss-army-knife-react',
  ]

  const allSiblingPackageEntries = Object.entries(allSiblingPackages)

  const targetPackageName: string = await (async () => {
    if (args[0]) { return args[0] }
    const siblingPackageEntriesExcludingEssentials = allSiblingPackageEntries.filter(
      ([, packageName]) => !essentialPackagesNames.includes(packageName)
    )
    console.log('Please select a target package to bump version:')
    console.log(`  1. ${ESSENTIALS} ${chalk.grey(`(${essentialPackagesNames.join(', ')})`)}`)
    siblingPackageEntriesExcludingEssentials.forEach(([packageDirectory, packageName], index) => {
      const bullet = String(index + 2).padStart(2, ' ')
      console.log(` ${bullet}. ${packageDirectory} ${chalk.grey(`(${packageName})`)}`)
    })
    const targetNumber = await ask(chalk.grey('question') + ' Target: ')
    if (targetNumber === '1') {
      return ESSENTIALS // Early exit
    }
    const resolvedTarget = siblingPackageEntriesExcludingEssentials[Number(targetNumber) - 2]
    if (!resolvedTarget) {
      console.log(chalk.redBright(`[Error] Invalid target: "${targetNumber}"`))
      process.exit(1)
    }
    return resolvedTarget[1]
  })()

  const isBumpingEssentials = targetPackageName === ESSENTIALS

  if (isBumpingEssentials) {
    console.log(
      'Selected: ' +
      chalk.cyanBright(ESSENTIALS) + ' ' +
      chalk.cyan(`(${essentialPackagesNames.join(', ')})`)
    )
  } else {
    const [targetPackageDirectory] = allSiblingPackageEntries.find(([, packageName]) => {
      return packageName === targetPackageName
    })!
    console.log(
      'Selected: ' +
      chalk.cyanBright(targetPackageDirectory) + ' ' +
      chalk.cyan(targetPackageName)
    )
  }

  const currentPackageVersion: string = (() => {
    if (isBumpingEssentials) {
      return readPackageJson(PROJECT_ROOT_DIRECTORY).version
    } else {
      const [targetPackageDirectory] = allSiblingPackageEntries.find(([, packageName]) => {
        return packageName === targetPackageName
      })!
      return readPackageJson(path.join(PACKAGES_DIRECTORY, targetPackageDirectory)).version
    }
  })()!

  const newVersion = await (async () => {
    if (args[1]) { return args[1] }
    console.log(chalk.blueBright('info') + ` Current version: ${currentPackageVersion}`)
    return await ask(chalk.grey('question') + ' New version: ')
  })()
  if (!/^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/.test(newVersion)) {
    console.log(chalk.redBright(`[Error] Invalid new version: "${newVersion}"`))
    process.exit(1)
  }

  const gitStatusOutput = execSync('git status --porcelain', {
    encoding: Encoding.UTF_8,
  }).trim()

  if (gitStatusOutput) {
    console.log(chalk.redBright('[Error] Cannot bump version when there are uncommitted git changes'))
    process.exit(1)
  }

  if (isBumpingEssentials) {

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

    const _reactPackageJson = mutatePackageJson(
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

    const otherSiblingPackages = objectFilter(
      allSiblingPackages,
      (packageName) => !essentialPackagesNames.includes(packageName),
    )

    Object.entries(otherSiblingPackages).forEach(([packageDirectory]) => {
      mutatePackageJson(path.join(PACKAGES_DIRECTORY, packageDirectory), (pkg) => {
        essentialPackagesNames.forEach((packageName) => {
          setDependencyVersion(pkg, packageName, newVersion)
        })
        return pkg
      })
    })

  } else {

    const [targetPackageDirectory] = allSiblingPackageEntries.find(([, packageName]) => {
      return packageName === targetPackageName
    })!

    const _targetPackageJson = mutatePackageJson(
      path.join(PACKAGES_DIRECTORY, targetPackageDirectory),
      (pkg) => ({
        ...pkg,
        version: newVersion,
      } as PackageJson),
    )

    const otherSiblingPackages = objectFilter(
      allSiblingPackages,
      (packageName) => packageName !== targetPackageName,
    )

    Object.entries(otherSiblingPackages).forEach(([packageDirectory]) => {
      mutatePackageJson(path.join(PACKAGES_DIRECTORY, packageDirectory), (pkg) => {
        setDependencyVersion(pkg, targetPackageName, formatVersion(newVersion))
        return pkg
      })
    })

  }

  // todo
  console.log('not yet tested')
  process.exit(1)
  execSync([
    'git add .',
    `git commit -m 'v${newVersion}'`,
    `git tag 'v${newVersion}'`,
  ].join(' && '))

}

const [, , ...args] = process.argv
run(...args)

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
      rl.close()
    })
    // rl.on('close', () => { resolve('') })
  })
}

function formatVersion(version: string | undefined): string {
  if (!version) { return '*' } // Early exit
  return /^\d+\.\d+\.\d+$/.test(version) ? `^${version}` : version
}
