import { Head, Html, Main, NextScript } from 'next/document'
import { JSX } from 'react'

function Document(): JSX.Element {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
