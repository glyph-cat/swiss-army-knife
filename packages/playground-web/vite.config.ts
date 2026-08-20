import type * as RushLib from '@microsoft/rush-lib'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'
import { readFileSync } from 'node:fs'
import { type ServerOptions as HttpsServerOptions } from 'node:https'
import path from 'node:path'
import { defineConfig, type PreviewOptions, type ServerOptions } from 'vite'

const require = createRequire(import.meta.url)
const { RushConfiguration } = require('@microsoft/rush-lib') as typeof RushLib

// https://vite.dev/config/
export default defineConfig((env) => {
  const rushConfig = RushConfiguration.loadFromDefaultLocation()
  const monorepoRoot = rushConfig.rushJsonFolder
  const certificatesDirectory = path.join(monorepoRoot, 'certificates')
  const httpsOptions: HttpsServerOptions = {
    key: readFileSync(path.join(certificatesDirectory, 'localhost-key.pem')),
    cert: readFileSync(path.join(certificatesDirectory, 'localhost.pem')),
  }
  const commonViteServerOptions: ServerOptions & PreviewOptions = {
    port: 3000,
    host: '0.0.0.0',
    https: httpsOptions,
  }
  return {
    server: commonViteServerOptions,
    preview: commonViteServerOptions,
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.mode),
    },
  }
})
