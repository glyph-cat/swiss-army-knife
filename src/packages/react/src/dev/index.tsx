import { DevLogType, devPrint } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'

/**
 * @public
 */
export interface JsxLineTracerProps {
  type?: DevLogType
  message?: string
}

/**
 * @example
 * return (
 *   <View>
 *     <JsxLineTracer type='log' message='...' />
 *     <ComponentA />
 *   </View>
 * )
 * @public
 */
export function JsxLineTracer(props: JsxLineTracerProps): JSX.Element {
  const { type = 'info', message = '(Empty string)' } = props
  devPrint(type, message)
  return null
}
