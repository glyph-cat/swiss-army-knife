// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function __setDisplayName(item: unknown): void { /* ... */ }

export function __getDisplayName(item: unknown): string {
  return item['displayName'] ?? item['name']
}
