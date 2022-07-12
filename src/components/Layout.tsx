import Head from 'next/head'
import { Header } from './Header'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Chunkey</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen w-full flex-col overflow-y-scroll bg-slate-900 p-4 text-slate-50">
        <Header />
        {children}
      </div>
    </>
  )
}
