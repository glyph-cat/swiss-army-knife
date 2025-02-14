import { TruthRecord } from '@glyph-cat/swiss-army-knife'
import { Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from 'react'

/**
 * @public
 */
export interface ISelectionController<T> {
  selection: TruthRecord<string>
  setSelection: Dispatch<SetStateAction<TruthRecord<string>>>
  selectionCount: number
  selectedItems: Array<T>
  onSelectAll(): void
}

/**
 * @param allItems - All items.
 * @param keyExtractor - A function that is invoked for every selected item. It should return a string that uniquely identifies each item.
 * @public
 */
export function useSelectionController<T>(
  allItems: Array<T>,
  keyExtractor: (item: T) => string,
): ISelectionController<T> {

  const keyExtractorRef = useRef<typeof keyExtractor>(null)
  keyExtractorRef.current = keyExtractor

  const [selection, setSelection] = useState<TruthRecord<string>>({})
  const selectionCount = Object.keys(selection).length
  const selectedItems = useMemo(() => {
    const data: Array<T> = []
    for (const id in selection) {
      const foundItem = allItems.find((item) => keyExtractorRef.current(item) === id)
      if (foundItem) { data.push(foundItem) }
    }
    return data
  }, [allItems, selection])

  const onSelectAll = useCallback(() => {
    if (selectionCount !== allItems.length) {
      setSelection(Object.values(allItems).reduce((acc, item) => {
        acc[keyExtractorRef.current(item)] = true
        return acc
      }, {}))
    } else {
      setSelection({})
    }
  }, [allItems, selectionCount])

  return {
    selection,
    setSelection,
    selectionCount,
    selectedItems,
    onSelectAll,
  }

}
