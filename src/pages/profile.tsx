import { zodResolver } from '@hookform/resolvers/zod'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { TypeOf, z } from 'zod'
import { CheckIcon } from '../components/CheckIcon'
import { useProfileContext } from '../components/ProfileProvider'
import { WarningIcon } from '../components/WarningIcon'
import { trpc } from '../utils/trpc'

const displayNameFormSchema = z
  .object({
    displayName: z.string(),
    profileId: z.string(),
  })
  .required()
type DisplayNameFormSchema = TypeOf<typeof displayNameFormSchema>

const Profile: NextPage = () => {
  const profile = useProfileContext()
  const utils = trpc.useContext()
  const mutateDisplayName = trpc.useMutation('profile.updateDisplayName', {
    onSuccess: () => {
      utils.invalidateQueries(['profile.get'])
    },
  })
  const session = useSession()

  const displayName = (profile?.displayName || session.data?.user?.name) ?? ''

  const { register, handleSubmit } = useForm<DisplayNameFormSchema>({
    resolver: zodResolver(displayNameFormSchema),
  })

  const onSubmit = async ({
    displayName,
    profileId,
  }: DisplayNameFormSchema) => {
    try {
      mutateDisplayName.mutate({
        displayName,
        id: profileId,
      })
    } catch (error) {}
  }

  if (!profile) return null

  return (
    <div className="">
      <h1 className="mb-16 px-4 text-5xl font-extrabold uppercase">Profile</h1>
      {profile && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col bg-slate-800 px-4 py-6">
            <label
              className="mb-2 text-2xl font-extrabold"
              htmlFor="displayName"
            >
              Your name
            </label>
            <p className="mb-4 text-slate-400">
              Enter your name or a display name that you are comfortable with.
            </p>
            <div className="mb-4 flex items-center gap-2">
              <input
                className="max-w-prose rounded-lg border bg-slate-800 px-4 py-2"
                type="text"
                defaultValue={displayName}
                {...register('displayName')}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
              />
              {mutateDisplayName.isSuccess && (
                <div className="text-green-500">
                  <CheckIcon />
                </div>
              )}

              {mutateDisplayName.error && (
                <div className="text-red-500">
                  <WarningIcon />
                </div>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="rounded-lg border bg-slate-300 px-3 py-1 text-slate-800"
              >
                Save
              </button>
            </div>
          </div>
          <input type="hidden" value={profile.id} {...register('profileId')} />
        </form>
      )}
    </div>
  )
}

export default Profile
