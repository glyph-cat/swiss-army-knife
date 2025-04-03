// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function __setDisplayName(item: unknown): void { /* ... */ }

export function __getDisplayName(item: unknown): string {
  return item['displayName'] ?? item['name']
}

const TypeMarkerKey = '$$TypeMarker'

export enum TypeMarker {
  PopoverTrigger = 1,
  MenuTrigger,
  CoreNavStackItem,
  CoreNavBranchItem,
}

export function __setTypeMarker(component: unknown, type: TypeMarker): void {
  component[TypeMarkerKey] = type
}

export function __getTypeMarker(component: unknown): TypeMarker {
  return component[TypeMarkerKey]
}
