import { Checkbox, CheckboxProps } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useState } from 'react'
import { TESTING, TESTING_RTL, UI_SIZES } from '../../constants'
import { VariationDisplayContainer } from '../variation-display-container'

export interface CheckboxVariationProps extends Omit<CheckboxProps, 'size'> {
  rtl?: boolean
}

export function CheckboxVariation({
  rtl,
  ...props
}: CheckboxVariationProps): ReactNode {
  const [states, setStates] = useState(UI_SIZES.map(() => props.value))
  return (
    <VariationDisplayContainer style={rtl ? { direction: 'rtl' } : {}}>
      {UI_SIZES.map((size, index) => {
        return (
          <Checkbox
            {...props}
            key={size}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(newValue) => {
              setStates((s) => {
                const nextState = [...s]
                nextState.splice(index, 1, newValue)
                return nextState
              })
            }}
            value={states[index]}
            size={size}
          >
            {rtl ? TESTING_RTL : TESTING}
          </Checkbox>
        )
      })}
    </VariationDisplayContainer>
  )
}
