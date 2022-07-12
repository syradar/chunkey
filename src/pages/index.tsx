import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { Header } from '../components/Header'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const hello = trpc.useQuery(['example.getAll'])

  const { data, status } = useSession()
  console.log(data, status)

  return (
    <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
      {hello.data ? (
        <div>
          {hello.data.map(d => (
            <div key={d.id}>{d.id}</div>
          ))}
        </div>
      ) : (
        <p>Loading..</p>
      )}
    </div>
  )
}

export default Home
