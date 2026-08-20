import 'jest-extended'
import 'react'

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}


declare global {

  declare module '*.module.css' {
    const classes: { [key: string]: string }
    export default classes
  }

}
