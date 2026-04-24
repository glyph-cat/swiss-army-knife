import { Empty } from '@glyph-cat/foundation'
import { BasicButton, View } from '@glyph-cat/swiss-army-knife-react'
import ClipboardJS from 'clipboard'
import clsx from 'clsx'
import { ChangeEvent, ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useLocalization } from '~services/localization'
import styles from './index.module.css'

const ID_OUTPUT_AREA = 'output-area'

export default function (): ReactNode {

  const [text, setText] = useState(Empty.STRING)
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => {
    const cb = new ClipboardJS(copyButtonRef.current!)
    return () => { cb.destroy() }
  }, [])

  const { localize } = useLocalization()

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
          color='primary'
          ref={copyButtonRef}
          data-clipboard-target={`#${ID_OUTPUT_AREA}`}
          disabled={text.length <= 0}
        >
          {localize('COPY')}
        </BasicButton>
      </View>
      <View className={styles.contentContainer}>
        <textarea
          className={clsx(styles.textAreaBase, styles.inputTextArea, 'code')}
          value={text}
          onChange={useCallback((e: ChangeEvent<HTMLTextAreaElement>) => { setText(e.target.value) }, [])}
          placeholder={localize('ENTER_SOME_TEXT_HERE')}
        />
        <View
          id={ID_OUTPUT_AREA}
          className={clsx(styles.textAreaBase, styles.outputTextArea)}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </View>
    </View>
  )
}
