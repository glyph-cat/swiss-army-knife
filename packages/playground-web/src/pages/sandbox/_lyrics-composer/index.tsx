import { Empty } from '@glyph-cat/foundation'
import { delay, multilineTrim } from '@glyph-cat/swiss-army-knife'
import { BasicButton, View } from '@glyph-cat/swiss-army-knife-react'
import ClipboardJS from 'clipboard'
import clsx from 'clsx'
import { ChangeEvent, ReactNode, useCallback, useDeferredValue, useState } from 'react'
import { useLocalization } from '~services/localization'
import styles from './index.module.css'

export default function (): ReactNode {

  const { localize } = useLocalization()

  const [text, setText] = useState(Empty.STRING)
  const deferredText = useDeferredValue(text)
  const processedText = multilineTrim(processLyrics(deferredText))

  const [copied, setCopiedState] = useState(false)

  return (
    <View className={styles.container}>
      <View className={styles.buttonsContainer}>
        <BasicButton
          disabled={text.length <= 0}
          onClick={useCallback(() => {
            setText(Empty.STRING)
          }, [])}
        >
          {localize('CLEAR_ALL')}
        </BasicButton>
        <View />
        <BasicButton
          color={copied ? 'success' : 'primary'}
          disabled={text.length <= 0}
          onClick={useCallback(async () => {
            ClipboardJS.copy(processedText)
            setCopiedState(true)
            await delay(3000)
            setCopiedState(false)
          }, [processedText])}
        >
          {localize(copied ? 'COPIED' : 'COPY')}
        </BasicButton>
      </View>
      <View className={styles.contentContainer}>
        <View>
          <textarea
            className={clsx(styles.textAreaBase, styles.inputTextArea, 'code')}
            value={text}
            onChange={useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
              setText(e.target.value)
            }, [])}
            placeholder={localize('ENTER_SOME_TEXT_HERE')}
          />
        </View>
        <View>
          <textarea
            className={clsx(styles.textAreaBase, styles.outputTextArea, 'code')}
            value={processedText}
            placeholder={localize('THE_OUTPUT_WILL_APPEAR_HERE')}
            readOnly
          />
        </View>
      </View>
    </View>
  )
}

function processLyrics(value: string): string {
  const verses = value.split(/\n+%%\s*---\s*%%\n+/g)
  return verses.map((rawVerse) => {
    const lineBlobs = rawVerse.split(/\n\n/g).filter((x) => !!x)
    const lines = lineBlobs.map((lineBlob) => {
      const firstLine = lineBlob.split(/\n/g)[0] ?? ''
      return firstLine
    })
    return lines.join('\n')
  }).join('\n\n')
}
