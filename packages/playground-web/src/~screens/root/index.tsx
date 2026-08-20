import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { AppRoute } from '~constants'

function RootScreen(): ReactNode {
  const router = useRouter()
  useEffect(() => {
    router.replace(AppRoute.SANDBOX)
  }, [router])
  return null
}

export default RootScreen
