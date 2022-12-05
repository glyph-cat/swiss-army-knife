import { JSONclone } from '../../json'

const SOURCE_COLLECTION = {
  'a': { height: 10, width: 20 }, //  200
  'b': { height: 50, width: 30 }, // 1500
  'c': { height: 20, width: 30 }, //  600
  'd': { height: 40, width: 60 }, // 2400
  'e': { height: 70, width: 40 }, // 2800
} as const

/**
 * @internal
 */
export function generateTestCollection(): typeof SOURCE_COLLECTION {
  return JSONclone(SOURCE_COLLECTION)
}
