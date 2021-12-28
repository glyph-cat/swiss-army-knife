import { useCallback, useState } from 'react'
import { PaymentPointer } from '../../../../src'

export function PaymentPointerProtectorContainer(): JSX.Element {
  const [paymentPointer, setPaymentPointer] = useState('1234')

  const handlePaymentPointerChange = useCallback((e) => {
    setPaymentPointer(e.target.value)
  }, [])

  const tamperWithPaymentPointer = useCallback(() => {
    const metaElement = document.querySelector('meta[name="monetization"]')
    const oldContentValue = metaElement.getAttribute('content')
    const newContentValue = 'abcde'
    console.log(
      `Changing content value from '${oldContentValue}' to '${newContentValue}'`
    )
    metaElement.setAttribute('content', newContentValue)
  }, [])

  return (
    <div>
      <PaymentPointer value={paymentPointer} />
      <input
        value={paymentPointer}
        onChange={handlePaymentPointerChange}
        style={{
          fontSize: '18pt',
        }}
      />
      <br />
      <button onClick={tamperWithPaymentPointer}>
        {'Tamper with payment pointer'}
      </button>
    </div>
  )
}
