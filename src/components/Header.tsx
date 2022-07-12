import { Menu, Transition } from '@headlessui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { Fragment } from 'react'
import { classNames } from '../utils/classNames'

export const Header = () => {
  const { data, status } = useSession()

  const authenticated = status === 'authenticated'
  const name = data?.user?.name ?? 'Guest'
  const email = data?.user?.email ?? undefined
  const imageUrl = data?.user?.image ?? undefined

  return (
    <header className="flex justify-between">
      <h2 className="text-purple-300 font-extrabold">Chunkey</h2>
      {authenticated && (
        <ProfileDropdown name={name} email={email} imageUrl={imageUrl} />
      )}

      {!authenticated && (
        <button type="button" onClick={() => signIn('github', {})}>
          Login with GitHub
        </button>
      )}
    </header>
  )
}

const ProfileDropdown = ({
  name,
  email,
  imageUrl,
}: {
  name: string
  email?: string
  imageUrl?: string
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="px-2 py-1 hover:text-purple-300">
        {imageUrl && (
          <div>
            <div className="rounded-full w-8 h-8 border-2 border-transparent hover:border-white">
              <Image
                className="rounded-full w-8 h-8"
                src={imageUrl}
                alt={name}
                width={32}
                height={32}
              />
            </div>
          </div>
        )}

        {!imageUrl && (
          <span className="text-purple-300">{name.split(' ')[0]}</span>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2 flex flex-col gap-2">
            {email && (
              <Menu.Item>
                <div className="text-sm">Logged in as {email}</div>
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => signOut({})}
                  className={classNames(
                    active ? 'bg-purple-500' : 'bg-slate-700',
                    'block px-4 py-2 text-sm w-full text-left rounded-lg font-medium',
                  )}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
