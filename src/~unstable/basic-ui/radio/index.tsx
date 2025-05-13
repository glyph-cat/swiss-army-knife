import { View } from '@glyph-cat/swiss-army-knife-react'
import { JSX } from 'react'

export interface RadioGroupProps {
  children: any
}

export function RadioGroup({
  children,
}: RadioGroupProps): JSX.Element {
  return (
    <View>
      {/* ... */}
    </View>
  )
}

export interface RadioItemProps {
  children: any
}

export function RadioItem({
  children,
}: RadioItemProps): JSX.Element {
  return (
    <label>
      {/* ... */}
    </label>
  )
}
