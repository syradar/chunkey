import { useSession } from 'next-auth/react'

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession()
  if (status === 'loading') return null

  return <>{children}</>
}
