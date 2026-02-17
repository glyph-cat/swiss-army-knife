import { Input, InputProps } from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { ForwardedRef, forwardRef, JSX } from 'react'
import { styles } from './styles'

// TODO: autofill candidate?
// TODO: start icon
// TODO: end icon

// TODO: <SearchInput /> (has clear button)
// TODO: <MultilineTextInput />

export interface TextInputProps extends InputProps {

}

export const TextInput = forwardRef(({
  className,
  ...props
}: TextInputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
  return (
    <Input
      className={clsx(styles.input, className)}
      ref={ref}
      {...props}
    />
  )
})
