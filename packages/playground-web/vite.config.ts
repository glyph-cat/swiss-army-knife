import type * as RushLib from '@microsoft/rush-lib'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'module'
import { readFileSync } from 'node:fs'
import { type ServerOptions as HttpsServerOptions } from 'node:https'
import path from 'node:path'
import { defineConfig, type PreviewOptions, type ServerOptions } from 'vite'

const require = createRequire(import.meta.url)
const { RushConfiguration } = require('@microsoft/rush-lib') as typeof RushLib

export default defineConfig((env) => {
  const rushConfig = RushConfiguration.loadFromDefaultLocation()
  const monorepoRoot = rushConfig.rushJsonFolder
  const certificatesDirectory = path.join(monorepoRoot, 'certificates')
  const httpsOptions: HttpsServerOptions = {
    key: readFileSync(path.join(certificatesDirectory, 'localhost-key.pem')),
    cert: readFileSync(path.join(certificatesDirectory, 'localhost.pem')),
  }
  const commonViteServerOptions: ServerOptions & PreviewOptions = {
    https: httpsOptions,
  }
  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.mode),
    },
  }
})
