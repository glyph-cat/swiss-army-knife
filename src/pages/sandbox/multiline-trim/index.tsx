import { Empty, RefObject } from '@glyph-cat/foundation'
import { delay, multilineTrim } from '@glyph-cat/swiss-army-knife'
import { BasicButton, TextArea, View } from '@glyph-cat/swiss-army-knife-react'
import ClipboardJS from 'clipboard'
import clsx from 'clsx'
import { JSX, useCallback, useDeferredValue, useEffect, useRef, useState } from 'react'
import { useLocalization } from '~services/localization'
import styles from './index.module.css'

// TODO: Use Monaco Editor with option: Editor > Render Whitespace > all

export default function (): JSX.Element {

  const { localize } = useLocalization()

  const [text, setText] = useState(Empty.STRING)
  const deferredText = useDeferredValue(text)
  const textOverlay = addOverlayCharacters(deferredText)
  const sanitizedText = multilineTrim(deferredText)
  const sanitizedTextOverlay = addOverlayCharacters(sanitizedText)

  const [copied, setCopiedState] = useState(false)

  const inputMainRef = useRef<HTMLTextAreaElement>(null)
  const inputOverlayRef = useRef<HTMLTextAreaElement>(null)
  const outputMainRef = useRef<HTMLTextAreaElement>(null)
  const outputOverlayRef = useRef<HTMLTextAreaElement>(null)
  useSyncedScrolling(inputMainRef, [inputOverlayRef, outputMainRef])
  useSyncedScrolling(outputMainRef, [outputOverlayRef, inputMainRef])

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
            ClipboardJS.copy(sanitizedText)
            setCopiedState(true)
            await delay(3000)
            setCopiedState(false)
          }, [sanitizedText])}
        >
          {localize(copied ? 'COPIED' : 'COPY')}
        </BasicButton>
      </View>
      <View className={styles.contentContainer}>
        <View>
          <TextArea
            ref={inputMainRef}
            className={clsx(styles.textAreaBase, styles.inputTextArea, 'code')}
            value={text}
            onChange={useCallback((e) => { setText(e.target.value) }, [])}
            placeholder={localize('ENTER_SOME_TEXT_HERE')}
          />
          <TextArea
            ref={inputOverlayRef}
            className={clsx(styles.textAreaBase, styles.textAreaOverlay, 'code')}
            value={textOverlay}
            readOnly
          />
        </View>
        <View>
          <TextArea
            ref={outputMainRef}
            className={clsx(styles.textAreaBase, styles.outputTextArea, 'code')}
            value={sanitizedText}
            placeholder={localize('THE_OUTPUT_WILL_APPEAR_HERE')}
            readOnly
          />
          <TextArea
            ref={outputOverlayRef}
            className={clsx(styles.textAreaBase, styles.textAreaOverlay, 'code')}
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
    .replace(/\t/g, '→'.repeat(4))
    .replace(/ /g, '•')
}

function useSyncedScrolling<E extends HTMLElement>(
  sourceElementRef: RefObject<E>,
  listenerElementsRef: Array<RefObject<E>>,
): void {
  useEffect(() => {
    const target = sourceElementRef.current
    const onRefresh = (e: WheelEvent) => {
      for (const listenerElement of listenerElementsRef) {
        listenerElement.current.scroll({ top: (e.target as E).scrollTop })
      }
    }
    target.addEventListener('scroll', onRefresh)
    target.addEventListener('keyup', onRefresh) // for copy-pasting
    return () => {
      target.removeEventListener('scroll', onRefresh)
      target.removeEventListener('keyup', onRefresh)
    }
  }, [sourceElementRef, listenerElementsRef])
}
