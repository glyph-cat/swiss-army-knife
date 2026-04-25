import { StringRecord } from '@glyph-cat/foundation'
import {
  hasProperty,
  objectMap,
  objectReduce,
  TruthRecord,
} from '@glyph-cat/swiss-army-knife'
import { BasicButton, MaterialSymbol, View } from '@glyph-cat/swiss-army-knife-react'
import { isNumber } from '@glyph-cat/type-checking'
import clsx from 'clsx'
import { ChangeEvent, ReactNode, useCallback, useDeferredValue, useMemo, useState } from 'react'
import { v7 as uuid } from 'uuid'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {

  const [showAddValuesPopup, setAddValuesPopupVisibility] = useState(false)
  const [rawText, setRawText] = useState('')
  const onChangeRawText = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value)
  }, [])
  const deferredRawText = useDeferredValue(rawText)
  const previewedValuesToAdd = useMemo<Array<number>>(() => {
    return deferredRawText
      .matchAll(/\d+(\.\d+)?/g)
      .map((matchedString) => parseFloat(matchedString[0]))
      .filter((val) => isNumber(val))
      .toArray()
  }, [deferredRawText])

  const [values, setValues] = useState<StringRecord<number>>({})

  const commitValues = useCallback(() => {
    setValues((prevValues) => ({
      ...prevValues,
      ...previewedValuesToAdd.reduce((acc, previewedValue) => {
        acc[uuid()] = previewedValue
        return acc
      }, {} as typeof prevValues)
    }))
    setAddValuesPopupVisibility(false)
    setRawText('')
  }, [previewedValuesToAdd])

  const cancelAddValues = useCallback(() => {
    setAddValuesPopupVisibility(false)
    setRawText('')
  }, [])

  const [selection, setSelection] = useState<TruthRecord>({})

  const onToggleSelect = useCallback((valueId: string) => {
    setSelection((s) => {
      if (hasProperty(s, valueId)) {
        const { [valueId]: _, ...nextSelection } = s
        return nextSelection
      } else {
        return { ...(s as TruthRecord), [valueId]: true }
      }
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelection(objectReduce(values, (acc, _, valueId) => {
      acc[valueId] = true
      return acc
    }, {} as TruthRecord))
  }, [values])

  const deselectAll = useCallback(() => {
    setSelection({})
  }, [])

  const sum = useMemo(() => {
    return objectReduce(selection, (acc, _, valueId) => {
      return acc + values[valueId]
    }, 0)
  }, [selection, values])

  return (
    <>
      <SandboxContent className={styles.container}>
        <h1 className={styles.result}>
          {(isNumber(sum) ? sum : 0).toFixed(2)}
        </h1>
        <View className={styles.toolbar}>
          <BasicButton onClick={deselectAll}>
            {'Deselect all'}
          </BasicButton>
          <BasicButton onClick={selectAll}>
            {'Select all'}
          </BasicButton>
          <BasicButton
            onClick={useCallback(() => {
              setAddValuesPopupVisibility(true)
            }, [])}
          >
            {'Add values'}
          </BasicButton>
        </View>
        <View className={styles.valuesContainer}>
          {useMemo(() => {
            return objectMap(values, (value, valueId) => {
              return (
                <View
                  className={styles.valueCard}
                  data-selected={hasProperty(selection, valueId)}
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => { onToggleSelect(valueId) }}
                >
                  <View className={styles.valueCardValue}>
                    {value}
                  </View>
                  <View className={styles.valueCardRemoveButton}>
                    <MaterialSymbol
                      name='delete'
                    />
                  </View>
                </View>
              )
            })
          }, [onToggleSelect, selection, values])}
        </View>
        {showAddValuesPopup && (
          <View className={styles.scrim}>
            <View className={styles.popupContainer}>
              <View className={styles.popupContentContainer}>
                <textarea
                  className={clsx(styles.textArea, 'code')}
                  value={rawText}
                  onChange={onChangeRawText}
                />
                <textarea
                  className={clsx(styles.textArea, 'code')}
                  readOnly
                  value={previewedValuesToAdd.join('\n')}
                />
              </View>
              <View className={styles.popupButtonsContainer}>
                <BasicButton onClick={cancelAddValues}>
                  {'Cancel'}
                </BasicButton>
                <BasicButton color='primary' onClick={commitValues}>
                  {'Add'}
                </BasicButton>
              </View>
            </View>
          </View>
        )}
      </SandboxContent>
    </>
  )
}
