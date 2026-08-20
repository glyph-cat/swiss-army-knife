// import { Input, InputProps } from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { DetailedHTMLProps, InputHTMLAttributes, ForwardedRef, forwardRef } from 'react'
import { styles } from './styles'

// TODO: autofill candidate?
// TODO: start icon
// TODO: end icon

// TODO: <SearchInput /> (has clear button)
// TODO: <MultilineTextInput />

export interface TextInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {

}

export const TextInput = forwardRef(({
  className,
  ...props
}: TextInputProps, ref: ForwardedRef<HTMLInputElement>): ReactNode => {
  return (
    <input
      className={clsx(styles.input, className)}
      ref={ref}
      {...props}
    />
  )
})
