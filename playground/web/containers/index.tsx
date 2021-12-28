import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PATHS } from './paths'
import { MathContainer } from './math'
import { RootContainer } from './root'
import { PaymentPointerProtectorContainer } from './payment-pointer'

export function Containers(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route
          path={PATHS.root}
          element={<RootContainer />}
        />
        <Route
          path={PATHS.math}
          element={<MathContainer />}
        />
        <Route
          path={PATHS.paymentPointer}
          element={<PaymentPointerProtectorContainer />}
        />
      </Routes>
    </Router>
  )
}
