import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const WithProtectedRoute = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'unauthenticated') {
    return null
  }

  return <>{children}</>
}
