import { TextEncoder, TextDecoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })

// References:
// - Why am I getting "TextEncoder is not defined" in Jest?
//   https://stackoverflow.com/a/68468204/5810737
// - Typescript with Jest - "ReferenceError: beforeAll is not defined"
//   https://stackoverflow.com/a/69169372/5810737
