import { c, Empty, multilineTrim } from '@glyph-cat/swiss-army-knife'
import { BasicButton, TextArea, View } from '@glyph-cat/swiss-army-knife-react'
import ClipboardJS from 'clipboard'
import { JSX, useCallback, useDeferredValue, useState } from 'react'
import styles from './index.module.css'

export default function (): JSX.Element {

  const [text, setText] = useState(Empty.STRING)
  const deferredText = useDeferredValue(text)
  const textOverlay = addOverlayCharacters(deferredText)
  const sanitizedText = multilineTrim(deferredText)
  const sanitizedTextOverlay = addOverlayCharacters(sanitizedText)

  return (
    <View className={styles.container}>
      <View className={styles.buttonsContainer}>
        <BasicButton
          disabled={text.length <= 0}
          onClick={useCallback(() => {
            setText(Empty.STRING)
          }, [])}
        >
          {'Clear all'}
        </BasicButton>
        <View />
        <BasicButton
          color='primary'
          disabled={text.length <= 0}
          onClick={useCallback(() => {
            ClipboardJS.copy(sanitizedText)
          }, [sanitizedText])}
        >
          {'Copy'}
        </BasicButton>
      </View>
      <View className={styles.contentContainer}>
        <View>
          <TextArea
            className={c(styles.textAreaBase, styles.inputTextArea, 'code')}
            value={text}
            onChange={useCallback((e) => { setText(e.target.value) }, [])}
            placeholder={'Enter some text here...'}
          />
          <TextArea
            className={c(styles.textAreaBase, styles.textAreaOverlay, 'code')}
            value={textOverlay}
            readOnly
          />
        </View>
        <View>
          <TextArea
            className={c(styles.textAreaBase, styles.outputTextArea, 'code')}
            value={sanitizedText}
            placeholder={'The output will appear here...'}
            readOnly
          />
          <TextArea
            className={c(styles.textAreaBase, styles.textAreaOverlay, 'code')}
            value={sanitizedTextOverlay}
            readOnly
          />
        </View>
      </View>
    </View>
  )
}

function addOverlayCharacters(value: string): string {
  return value
    .replace(/\n/g, '↵\n')
    .replace(/\t/g, '•••••')
    .replace(/ /g, '•')
}
