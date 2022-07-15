import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { WithProtectedRoute } from './WithProtectedRoute'

const PROTECTED_ROUTES = ['/profile', '/dashboard']

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession()
  const router = useRouter()
  if (status === 'loading') return null

  return (
    <>
      {PROTECTED_ROUTES.includes(router.pathname) ? (
        <WithProtectedRoute>{children}</WithProtectedRoute>
      ) : (
        children
      )}
    </>
  )
}
