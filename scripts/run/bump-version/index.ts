import chalk from 'chalk'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { ENCODING_UTF_8 } from '../../constants'

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
    encoding: ENCODING_UTF_8,
  }).trim()

  if (gitStatusOutput) {
    console.log(chalk.redBright('Cannot bump version when there are uncommitted git changes'))
    process.exit(1)
  }

  const PROPERTY_KEY_VERSION = 'version'
  const PACKAGE_JSON = 'package.json'
  const PACKAGES_PATH = './packages'

  const rootPackageJsonPath = `./${PACKAGE_JSON}`
  const rootPackageJson = readJson(rootPackageJsonPath)
  rootPackageJson[PROPERTY_KEY_VERSION] = version
  writeJson(rootPackageJsonPath, rootPackageJson)

  const corePackageJsonPath = `${PACKAGES_PATH}/core/${PACKAGE_JSON}`
  const corePackageJson = readJson(corePackageJsonPath)
  corePackageJson[PROPERTY_KEY_VERSION] = version
  writeJson(corePackageJsonPath, corePackageJson)

  const reactPackageJsonPath = `${PACKAGES_PATH}/react/${PACKAGE_JSON}`
  const reactPackageJson = readJson(reactPackageJsonPath)
  reactPackageJson[PROPERTY_KEY_VERSION] = version
  writeJson(reactPackageJsonPath, reactPackageJson)

  const reactPlaygroundPackageJsonPath = `${PACKAGES_PATH}/playground-react/${PACKAGE_JSON}`
  const reactPlaygroundPackageJson = readJson(reactPlaygroundPackageJsonPath)
  reactPlaygroundPackageJson[PROPERTY_KEY_VERSION] = version
  writeJson(reactPlaygroundPackageJsonPath, reactPlaygroundPackageJson)

  execSync(`git add ${[
    rootPackageJsonPath,
    corePackageJsonPath,
    reactPackageJsonPath,
    reactPlaygroundPackageJsonPath,
  ].join(' ')}`)
  execSync(`git commit -m 'v${version}'`)
  execSync(`git tag 'v${version}'`)

}

run(process.argv[2])

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, ENCODING_UTF_8))
}

function writeJson(path: string, object: Record<string, unknown>): void {
  writeFileSync(path, JSON.stringify(object, null, 2), ENCODING_UTF_8)
}
