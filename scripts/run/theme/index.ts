import { writeFileSync } from 'fs'
import {
  Casing,
  DO_NOT_MODIFY_WARNING,
  Encoding,
  getFirstValue,
  IComponentParameters,
  IDurationDefinition,
  ISpacingDefinition,
  IThemePalette,
  StringRecord,
} from '../../../src/packages/core/src'
import { THEME_DICTIONARY } from '../../../src/~services/theme/constants'

const SAMPLE_DICTIONARY = getFirstValue(THEME_DICTIONARY)

interface ISnippet {
  description: string
  scope: string
  prefix: string
  body: string | Array<string>
}

function main(): void {

  const snippets: StringRecord<ISnippet> = {}

  for (const key in SAMPLE_DICTIONARY.palette) {
    const property = new Casing(key).toCamelCase()
    const token = `var(--${property})`
    snippets[property] = {
      description: `Palette ${SAMPLE_DICTIONARY.palette[key as keyof IThemePalette]}`,
      scope: 'css',
      prefix: token,
      body: token,
    }
  }

  for (const key in SAMPLE_DICTIONARY.spacing) {
    const property = `spacing${key}`
    const token = `var(--${property})`
    snippets[property] = {
      description: `Spacing ${SAMPLE_DICTIONARY.spacing[key as keyof ISpacingDefinition]}px`,
      scope: 'css',
      prefix: token,
      body: token,
    }
  }

  for (const key in SAMPLE_DICTIONARY.duration) {
    const property = `duration${new Casing(key).toPascalCase()}`
    const token = `var(--${property})`
    snippets[property] = {
      description: `Duration ${SAMPLE_DICTIONARY.duration[key as keyof IDurationDefinition]}ms`,
      scope: 'css',
      prefix: token,
      body: token,
    }
  }

  for (const key in SAMPLE_DICTIONARY.componentParameters) {
    const property = new Casing(key).toCamelCase()
    const token = `var(--${property})`
    snippets[property] = {
      description: `Component parameter ${SAMPLE_DICTIONARY.componentParameters[key as keyof IComponentParameters]}`,
      scope: 'css',
      prefix: token,
      body: token,
    }
  }

  writeFileSync('./.vscode/theme.code-snippets', [
    DO_NOT_MODIFY_WARNING,
    JSON.stringify(snippets),
    '',
  ].join('\n'), Encoding.UTF_8)

}

main()
