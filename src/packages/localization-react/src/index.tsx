import {
  IDictionaryData,
  ILocalizationContextState,
  Language,
  LocalizationContext,
} from '@glyph-cat/localization'
import { useSimpleStateValue } from 'cotton-box-react'
// import { JSX, memo, ReactNode, useContext } from 'react'
// import { HydrationMap, HydrationMapContext, useResolveHydrationLocalizationContext } from './internal'

// // TODO: Just use as external library instead of bundling it together?
// import { shallowCompareArray } from '../../equality/src/shallow-compare-array'
// import { shallowCompareObject } from '../../equality/src/shallow-compare-object'

// export interface LocalizationProviderProps<DictionaryData extends IDictionaryData> {
//   children?: ReactNode
//   context: LocalizationContext<DictionaryData>
//   language: Language<DictionaryData>
//   clientPreferredLanguages?: Array<string>
// }

// export const LocalizationProvider = memo(<DictionaryData extends IDictionaryData>(
//   props: LocalizationProviderProps<DictionaryData>,
// ): JSX.Element => {
//   if (typeof window !== 'undefined') {
//     return <>{props.children}</>
//   } else {
//     return <ServerProvider {...props} />
//   }
// }, (prevProps, nextProps) => {
//   const {
//     clientPreferredLanguages: prevClientPreferredLanguages,
//     ...remainingPrevProps
//   } = prevProps
//   const {
//     clientPreferredLanguages: nextClientPreferredLanguages,
//     ...remainingNextProps
//   } = nextProps
//   if (!shallowCompareObject(remainingPrevProps, remainingNextProps)) {
//     return false
//   }
//   if (!shallowCompareArray(prevClientPreferredLanguages, nextClientPreferredLanguages)) {
//     return false
//   }
//   return true
// })

// function ServerProvider<DictionaryData extends IDictionaryData>({
//   children,
//   context,
//   language,
//   clientPreferredLanguages,
// }: LocalizationProviderProps<DictionaryData>): JSX.Element {
//   const parentHydrationMap = useContext(HydrationMapContext) ?? new HydrationMap()
//   const childHydrationMap = new HydrationMap([
//     ...parentHydrationMap,
//     [context, new LocalizationContext(
//       context.dictionary,
//       language,
//       clientPreferredLanguages,
//     )],
//   ])
//   return (
//     <HydrationMapContext value={childHydrationMap}>
//       {children}
//     </HydrationMapContext>
//   )
// }

/**
 * @param localizationContext - The {@link LocalizationContext|`LocalizationContext`} to use
 * @param active - Controls whether the hook should watch for state changes and
 * trigger component update. Defaults to `true`.
 * @public
 */
export function useLocalizationContext<DictionaryData extends IDictionaryData>(
  localizationContext: LocalizationContext<DictionaryData>,
  active: boolean = true,
): LocalizationContext<DictionaryData> {
  // const effectiveContext = useResolveHydrationLocalizationContext(localizationContext)
  useSimpleStateValue(localizationContext.state, languageSelector, active)
  return localizationContext
}

function languageSelector(state: ILocalizationContextState<IDictionaryData>): Language<IDictionaryData> {
  return state.language
}
