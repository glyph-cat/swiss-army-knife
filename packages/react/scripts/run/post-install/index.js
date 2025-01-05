//@ts-check
const { execSync } = require('child_process')
const { readFileSync } = require('fs')

// WTF
// Error: Cannot find module '../../constants'
// const { ENCODING_UTF_8 } = require('../../constants')
const ENCODING_UTF_8 = 'utf-8'

function run() {
  try {
    const packageInfo = JSON.parse(readFileSync('./package.json', ENCODING_UTF_8))
    if (packageInfo.name === '@glyph-cat/swiss-army-knife-react') {
      execSync('sh ./scripts/run/post-install/script.sh')
    }
  } catch (e) {
    console.warn(e)
  }
}

run()
