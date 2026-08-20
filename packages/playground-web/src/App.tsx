import { lazy, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/',
    Component: lazy(() => import('./~screens/main')),
  },
])

function App(): ReactNode {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
