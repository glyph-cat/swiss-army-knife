import { Empty, getFirstKey, StringRecord } from '@glyph-cat/swiss-army-knife'
import { VirtualizedSectionListProps } from '../../../abstractions'

export function flattenOneLevelObject(wrappedReference: StringRecord): StringRecord {
  const objectName = getFirstKey(wrappedReference)[0]
  const targetObject = wrappedReference[objectName]
  if (!targetObject) { return Empty.OBJECT } // Early exit
  return Object.keys(targetObject).reduce((acc, propertyKey) => {
    acc[`${objectName}-${propertyKey}`] = targetObject[propertyKey]
    return acc
  }, {} as StringRecord)

}

export function flattenProps<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>
): StringRecord {
  const {
    SectionHeader,
    Item,
    ItemSeparator,
    SectionFooter,
    overscan,
    ...remainingProps
  } = props
  return {
    ...flattenOneLevelObject({ SectionHeader }),
    ...flattenOneLevelObject({ Item }),
    ...flattenOneLevelObject({ ItemSeparator }),
    ...flattenOneLevelObject({ SectionFooter }),
    ...flattenOneLevelObject({ overscan }),
    ...remainingProps,
  }
}
