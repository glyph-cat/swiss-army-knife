import { BasicButton, BasicButtonProps, MaterialSymbol } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { UI_SIZES } from '../../constants'
import { VariationDisplayContainer } from '../variation-display-container'

export interface BasicButtonVariationProps extends Omit<BasicButtonProps, 'size'> {
  // ...
}

export function ButtonVariation({
  ...props
}: BasicButtonVariationProps): ReactNode {
  return (
    <VariationDisplayContainer>
      {UI_SIZES.map((size) => {
        return (
          <BasicButton
            {...props}
            key={size}
            size={size}
          >
            {props.template === 'icon'
              ? <MaterialSymbol name='grass' />
              : 'Button'
            }
          </BasicButton>
        )
      })}
    </VariationDisplayContainer>
  )
}
