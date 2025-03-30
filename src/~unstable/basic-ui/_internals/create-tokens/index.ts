export function createTokens(key: string): Readonly<[key: string, identifier: string, token: string]> {
  const identifier = `--${key}`
  const token = `var(${identifier})`
  return [key, identifier, token]
}
