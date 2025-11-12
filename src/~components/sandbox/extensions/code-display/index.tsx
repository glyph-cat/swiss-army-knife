import { ColorScheme } from '@glyph-cat/swiss-army-knife'
import { useColorScheme } from '@glyph-cat/swiss-army-knife-react'
import Editor from '@monaco-editor/react'
import { JSX } from 'react'

// To import plaintext:
// - import SANDBOX_CODE from '!!raw-loader!./code.tsx'
// - File should also contain `// #region Example` and `// #endregion Example`

export interface CodeDisplayProps {
  value: string
}

export function CodeDisplay({
  value: $value,
}: CodeDisplayProps): JSX.Element {
  const colorScheme = useColorScheme()
  const value = $value.split(/\/\/\s*#\s*(end)?region\s+Example/gi).filter((i) => !!i)[1].trim()
  return (
    <Editor
      language='typescript-react'
      value={value}
      height={300}
      options={{
        fontSize: 16,
        minimap: {
          enabled: false,
        },
        readOnly: true,
        scrollBeyondLastLine: false,
        theme: colorScheme === ColorScheme.light ? 'vs' : 'vs-dark',
      }}
    />
  )
}
