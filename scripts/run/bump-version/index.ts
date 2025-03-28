import chalk from 'chalk'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { Encoding } from '../../../src/packages/core/src'

// What this script does:
// Bumps the versions of the root package along with its sub-packages.

function run(version: string): void {

  if (!version) {
    console.log(chalk.redBright(`Missing argument "${version}"`))
    process.exit(1)
  }

  if (!/^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/.test(version)) {
    console.log(chalk.redBright(`Invalid version "${version}"`))
    process.exit(1)
  }

  const gitStatusOutput = execSync('git status --porcelain', {
    encoding: Encoding.UTF_8,
  }).trim()

  if (gitStatusOutput) {
    console.log(chalk.redBright('Cannot bump version when there are uncommitted git changes'))
    process.exit(1)
  }

  const PROPERTY_KEY_VERSION = 'version'
  const PROPERTY_KEY_PEER_DEPENDENCIES = 'peerDependencies'
  const PROPERTY_KEY_NAME = 'name'

  const PACKAGE_JSON = 'package.json'
  const PACKAGES_PATH = path.join('.', 'src', 'packages')

  const rootPackageJsonPath = path.join('.', PACKAGE_JSON)
  const rootPackageJson = readJson(rootPackageJsonPath)
  rootPackageJson[PROPERTY_KEY_VERSION] = version
  writeJson(rootPackageJsonPath, rootPackageJson)

  const corePackageJsonPath = path.join(PACKAGES_PATH, 'core', PACKAGE_JSON)
  const corePackageJson = readJson(corePackageJsonPath)
  corePackageJson[PROPERTY_KEY_VERSION] = version
  writeJson(corePackageJsonPath, corePackageJson)

  const reactPackageJsonPath = path.join(PACKAGES_PATH, 'react', PACKAGE_JSON)
  const reactPackageJson = readJson(reactPackageJsonPath)
  reactPackageJson[PROPERTY_KEY_VERSION] = version
  reactPackageJson[PROPERTY_KEY_PEER_DEPENDENCIES][corePackageJson[PROPERTY_KEY_NAME] as string] = version
  writeJson(reactPackageJsonPath, reactPackageJson)

  execSync(`git add ${[
    rootPackageJsonPath,
    corePackageJsonPath,
    reactPackageJsonPath,
  ].join(' ')}`)
  execSync(`git commit -m 'v${version}'`)
  execSync(`git tag 'v${version}'`)

}

run(process.argv[2])

function readJson(fromPath: string): Record<string, unknown> {
  return JSON.parse(readFileSync(fromPath, Encoding.UTF_8))
}

function writeJson(toPath: string, object: Record<string, unknown>): void {
  writeFileSync(toPath, JSON.stringify(object, null, 2), Encoding.UTF_8)
}
