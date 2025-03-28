import { JSX } from 'react'
import styles from './index.module.css'

// Refs:
// - https://www.w3schools.com/tags/tag_meter.asp#:~:text=Definition%20and%20Usage,as%20in%20a%20progress%20bar).
// - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter

export interface MeterProps {
  value: number // temp
}

export function Meter({
  value,
}: MeterProps): JSX.Element {
  return (
    null
  )
}
