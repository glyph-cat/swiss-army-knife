import { c } from '@glyph-cat/css-utils'
import { ColorScheme } from '@glyph-cat/swiss-army-knife'
import {
  DeferRendering,
  MaterialSymbol,
  SizeAwareContainer,
  useColorScheme,
  useSizeAwareContext,
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
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <SizeAwareContainer>
        <WrappedEditor
          value={htmlContent}
          onChange={setHtmlContent}
        />
      </SizeAwareContainer>
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

interface WrappedEditorProps {
  value: string
  onChange(value: string): void
}

function WrappedEditor({
  value,
  onChange,
}: WrappedEditorProps): JSX.Element {
  const { height, width } = useSizeAwareContext()
  const colorScheme = useColorScheme()
  const editorRef = useRef<[$editor.IStandaloneCodeEditor, typeof $monaco]>(null)
  const editorTheme = colorScheme === ColorScheme.light ? 'light' : 'vs-dark'
  return (
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
        value={value}
        height='100vh'
        // height={height}
        // width={width}
        onChange={onChange}
        options={{
          fontSize: 16,
          scrollBeyondLastLine: false,
          theme: editorTheme,
        }}
      />
    </DeferRendering>
  )
}
