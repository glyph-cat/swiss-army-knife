import chalk from 'chalk'
import { execSync } from 'child_process'
import path from 'path'
import { Encoding } from '../../../src/packages/foundation/src/encoding'
import { readPackageJson } from '../../../src/packages/project-helpers/src/read-package-json'
import { setPackageVersion } from '../../../src/packages/project-helpers/src/set-package-version'
import {
  setPeerDependencyVersion,
} from '../../../src/packages/project-helpers/src/set-peer-dependency-version'
import { writePackageJson } from '../../../src/packages/project-helpers/src/write-package-json'

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

  const PACKAGE_JSON = 'package.json'
  const PACKAGES_PATH = path.join('.', 'src', 'packages')

  const rootPackageJsonPath = path.join('.', PACKAGE_JSON)
  const rootPackageJson = readPackageJson(rootPackageJsonPath)
  setPackageVersion(rootPackageJson, newVersion)
  writePackageJson(rootPackageJsonPath, rootPackageJson)

  const foundationPackageJsonPath = path.join(PACKAGES_PATH, 'foundation', PACKAGE_JSON)
  const foundationPackageJson = readPackageJson(foundationPackageJsonPath)
  setPackageVersion(foundationPackageJson, newVersion)
  writePackageJson(foundationPackageJsonPath, foundationPackageJson)

  const corePackageJsonPath = path.join(PACKAGES_PATH, 'core', PACKAGE_JSON)
  const corePackageJson = readPackageJson(corePackageJsonPath)
  setPackageVersion(corePackageJson, newVersion)
  setPeerDependencyVersion(corePackageJson, foundationPackageJson.name!, newVersion)
  writePackageJson(corePackageJsonPath, corePackageJson)

  const reactPackageJsonPath = path.join(PACKAGES_PATH, 'react', PACKAGE_JSON)
  const reactPackageJson = readPackageJson(reactPackageJsonPath)
  setPackageVersion(reactPackageJson, newVersion)
  setPeerDependencyVersion(reactPackageJson, foundationPackageJson.name!, newVersion)
  setPeerDependencyVersion(reactPackageJson, corePackageJson.name!, newVersion)
  writePackageJson(reactPackageJsonPath, reactPackageJson)

  execSync(`git add ${[
    rootPackageJsonPath,
    foundationPackageJsonPath,
    corePackageJsonPath,
    reactPackageJsonPath,
  ].join(' ')}`)
  execSync(`git commit -m 'v${newVersion}'`)
  execSync(`git tag 'v${newVersion}'`)

}

run(process.argv[2])
