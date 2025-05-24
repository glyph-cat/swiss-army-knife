// import { IDictionaryData, LocalizationContext } from '@glyph-cat/localization'
// import { createContext, useContext } from 'react'

// // Key = original state manager, Value = isolated/static state manager on server-side
// export class HydrationMap extends Map<LocalizationContext<any>, LocalizationContext<any>> { }

// export const HydrationMapContext = createContext<HydrationMap>(null)

// export function useResolveHydrationLocalizationContext<DictionaryData extends IDictionaryData>(
//   localizationContext: LocalizationContext<DictionaryData>,
// ): LocalizationContext<DictionaryData> {
//   const hydrationMap = useContext(HydrationMapContext)
//   if (typeof window !== 'undefined') {
//     return localizationContext // Early exit, client-side only.
//   }
//   return hydrationMap?.get(localizationContext) ?? localizationContext
// }

export { }
