/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function __setDisplayName(item: any): void { /* ... */ }

export function __getDisplayName(item: any): string {
  return item['displayName'] ?? item['name']
}
