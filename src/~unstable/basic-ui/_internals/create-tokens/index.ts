export function createTokens(key: string): Readonly<[identifier: string, token: string]> {
  const identifier = `--${key}`
  const token = `var(${identifier})`
  return [identifier, token]
}
