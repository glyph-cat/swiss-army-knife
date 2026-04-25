import { useRouter } from 'next/router'
import { JSX, useEffect } from 'react'
import { AppRoute } from '~constants'

function RootScreen(): JSX.Element {
  const router = useRouter()
  useEffect(() => {
    router.replace(AppRoute.SANDBOX)
  }, [router])
  return null
}

export default RootScreen
