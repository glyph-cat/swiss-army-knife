import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { ENCODING_UTF_8 } from '../../constants'

function run(): void {
  try {
    const packageInfo = JSON.parse(readFileSync('./package.json', ENCODING_UTF_8))
    console.log('packageInfo.name', packageInfo.name)
    if (packageInfo.name === '@glyph-cat/swiss-army-knife-react') {
      execSync('sh ./scripts/run/post-install/script.sh')
    }
  } catch (e) {
    console.warn(e)
  }
}

run()
