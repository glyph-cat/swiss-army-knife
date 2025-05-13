import { JSX } from 'react'
import { View } from '../../core/components/view'

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
