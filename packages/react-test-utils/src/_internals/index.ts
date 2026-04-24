import { InternalError } from '@glyph-cat/foundation'

export function throwInternalError(error: string | InternalError): never {
  console.error('This is most likely an internal software bug, please consider making a report at https://github.com/glyph-cat/swiss-army-knife/issues')
  if (error instanceof InternalError) {
    throw error
  } else {
    throw new InternalError(error)
  }
}
