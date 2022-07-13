import { Menu, Transition } from '@headlessui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { forwardRef, Fragment, HTMLProps } from 'react'
import { classNames } from '../utils/classNames'
import { useProfileContext } from './ProfileProvider'

export const Header = () => {
  const { data, status } = useSession()
  const profile = useProfileContext()

  const authenticated = status === 'authenticated'
  const email = data?.user?.email ?? undefined
  const imageUrl = data?.user?.image ?? undefined
  const name = (profile?.displayName || data?.user?.name) ?? undefined

  return (
    <header className="flex items-center justify-between p-4">
      <h2 className="text-lg font-extrabold hover:text-purple-300">
        <Link href="/">Chunkey</Link>
      </h2>
      {name}
      {authenticated && (
        <ProfileDropdown name={name} email={email} imageUrl={imageUrl} />
      )}

      {!authenticated && (
        <button
          type="button"
          onClick={() => signIn('github', { redirect: true })}
        >
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
  name?: string
  email?: string
  imageUrl?: string
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="px-2 py-1 hover:text-purple-300">
        {imageUrl && (
          <div>
            <div className="h-8 w-8 rounded-full border-2 border-transparent hover:border-white">
              <Image
                className="h-8 w-8 rounded-full"
                src={imageUrl}
                alt={name}
                width={32}
                height={32}
              />
            </div>
          </div>
        )}

        {!imageUrl && (
          <span className="text-purple-300">
            {!!name ? name.split(' ')[0] : 'User'}
          </span>
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
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="flex flex-col gap-2 p-2">
            {email && (
              <Menu.Item>
                <div className="text-sm">
                  Logged in as {name ?? email ?? 'User'}
                </div>
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <NextMenuLink
                  href="/profile"
                  className={classNames(
                    active ? 'bg-purple-500' : '',
                    'block px-4 py-2 text-sm w-full text-left rounded-lg font-medium',
                  )}
                >
                  Profile
                </NextMenuLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => signOut({})}
                  className={classNames(
                    active ? 'bg-purple-500' : '',
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

const NextMenuLink = forwardRef<
  HTMLAnchorElement,
  LinkProps & HTMLProps<HTMLAnchorElement>
>(({ href, children, ...rest }, ref) => {
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  )
})

NextMenuLink.displayName = 'NextMenuLink'
