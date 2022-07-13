import { Profile } from '@prisma/client'
import { createContext, useContext, useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'

type ProfileContextProps = Profile | undefined

const ProfileContext = createContext<ProfileContextProps>(undefined)

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined)
  const profileFromServer = trpc.useQuery(['profile.get'])

  useEffect(() => {
    if (profileFromServer.data) {
      setProfile(profileFromServer.data)
    }
  }, [profileFromServer, setProfile])

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => useContext(ProfileContext)
