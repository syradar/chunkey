import { Dialog } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { NextPage } from 'next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf, z } from 'zod'
import { WarningIcon } from '../components/WarningIcon'
import { trpc } from '../utils/trpc'

const TeamView = () => {
  const { data, isLoading } = trpc.useQuery(['team.getAll'])

  return (
    <div className="px-4">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl">Teams</h2>

        <CreateTeamButtonAndDialog />
      </header>
      <div className="flex flex-col gap-4">
        {!isLoading &&
          data &&
          data.map(team => (
            <article
              key={team.id}
              className="cursor-pointer rounded-lg bg-slate-800 p-4 hover:bg-purple-500"
            >
              <header className="">
                <h3>{team.name}</h3>
              </header>
              <div className="flex gap-4 text-white/60">
                <div>0 plans</div>
                <div>
                  {team.memberCount}{' '}
                  {team.memberCount === 1 ? 'member' : 'members'}
                </div>
                {team.profileRole.map(role => (
                  <div key={role}>
                    You are {role === 'admin' ? 'an' : 'a'} {role}
                  </div>
                ))}
              </div>
            </article>
          ))}
      </div>
    </div>
  )
}

const Dashboard: NextPage = () => {
  return (
    <div className="">
      <h1 className="mb-16 px-4 text-5xl font-extrabold uppercase">
        Dashboard
      </h1>
      <TeamView />
    </div>
  )
}

const createTeamFormSchema = z.object({
  name: z.string().min(1).max(100),
})
type CreateTeamFormSchema = TypeOf<typeof createTeamFormSchema>

const CreateTeamButtonAndDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const utils = trpc.useContext()
  const { mutate } = trpc.useMutation(['team.create'], {
    onSuccess: () => {
      utils.invalidateQueries(['team.getAll'])
      setIsOpen(false)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeamFormSchema>({
    resolver: zodResolver(createTeamFormSchema),
  })

  const onSubmit = async ({ name }: CreateTeamFormSchema) => {
    try {
      mutate({ name })
    } catch (error) {}
  }

  return (
    <>
      <button
        className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-purple-500 "
        type="button"
        onClick={() => setIsOpen(true)}
      >
        New team
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-slate-800 p-6 text-white">
            <Dialog.Title className="mb-1 text-2xl font-extrabold">
              Create new team
            </Dialog.Title>
            <Dialog.Description className="mb-4">
              You will become Admin of the new team.
            </Dialog.Description>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-8 flex flex-col gap-1">
                <label className="font-bold" htmlFor="name">
                  Team name
                </label>
                <input
                  {...register('name', {
                    required: true,
                    minLength: 1,
                    maxLength: 100,
                  })}
                  defaultValue=""
                  placeholder="My team"
                  type="text"
                  className="rounded-lg border bg-slate-800 px-4 py-2"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                />

                {(errors.name?.type === 'too_small' ||
                  errors.name?.type === 'maxLength') && (
                  <div className="flex gap-2">
                    <div className="text-red-500">
                      <WarningIcon />
                    </div>
                    <div className="text-red-500">
                      Name must be between 1 and 100 characters
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-2 text-white hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                >
                  Create
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default Dashboard
