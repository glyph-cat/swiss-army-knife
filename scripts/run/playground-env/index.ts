import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { description, name, version } from '../../../package.json'
import { DO_NOT_MODIFY_WARNING, Encoding } from '../../../src/packages/core/src'

const displayName = '_' // todo

function run(): void {

  const hash = (() => {
    try {
      return `${execSync('git rev-parse --short HEAD').toString().trim()}`
    } catch (e) {
      return null
    }
  })()

  writeFileSync(
    './src/~constants/env/index.scripted.ts',
    [
      DO_NOT_MODIFY_WARNING,
      `export const __SCRIPTED_GIT_COMMIT_SHA__ = ${JSON.stringify(hash)}`,
      `export const __SCRIPTED_GIT_REPO_URL__ = ''`, // TODO
      `export const __SCRIPTED_APP_VERSION__ = ${JSON.stringify(version)}`,
      `export const __SCRIPTED_APP_NAME__ = ${JSON.stringify(displayName)}`,
      `export const __SCRIPTED_APP_DESC__ = ${JSON.stringify(description)}`,
      `export const __SCRIPTED_PACKAGE_NAME__ = ${JSON.stringify(name)}`,
      '',
    ].join('\n'),
    Encoding.UTF_8
  )

}

run()
