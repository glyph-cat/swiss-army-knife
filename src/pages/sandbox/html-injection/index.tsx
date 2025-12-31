import { c, ColorScheme } from '@glyph-cat/swiss-army-knife'
import {
  DeferRendering,
  MaterialSymbol,
  useColorScheme,
  useForceUpdate,
  useWindowDimensions,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import Editor from '@monaco-editor/react'
import * as $monaco from 'monaco-editor'
import { editor as $editor } from 'monaco-editor'
import { JSX, useCallback, useRef, useState } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

export default function (): JSX.Element {
  const [htmlContent, setHtmlContent] = useState('')
  const colorScheme = useColorScheme()
  const editorRef = useRef<[$editor.IStandaloneCodeEditor, typeof $monaco]>(null)
  const editorTheme = colorScheme === ColorScheme.light ? 'light' : 'vs-dark'
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <View>
        <DeferRendering>
          <Editor
            onMount={useCallback((
              editor: $editor.IStandaloneCodeEditor,
              monaco: typeof $monaco,
            ) => {
              monaco.editor.setTheme(editorTheme)
              editorRef.current = [editor, monaco]
              return () => { editorRef.current = null }
            }, [editorTheme])}
            language='html'
            value={htmlContent}
            height='100vh'
            onChange={setHtmlContent}
            options={{
              fontSize: 16,
              scrollBeyondLastLine: false,
              theme: editorTheme,
            }}
          />
        </DeferRendering>
      </View>
      <View
        className={styles.contentContainer}
        style={htmlContent ? { display: 'initial' } : {}}
      >
        {htmlContent
          ? <View dangerouslySetInnerHTML={{ __html: htmlContent }} />
          : (
            <View style={{ placeItems: 'center' }}>
              <View className={styles.noContentHintContainer}>
                <MaterialSymbol
                  name='code_off'
                  size={120}
                />
                <span className={styles.noContentHintLabel}>
                  {'No content yet'}
                </span>
              </View>
            </View>
          )}
      </View>
    </View>
  )
}
