import type { NextPage } from 'next'

const Dashboard: NextPage = () => {
  return (
    <div className="">
      <h1 className="mb-16 px-4 text-5xl font-extrabold uppercase">
        Dashboard
      </h1>
      <div className="px-4">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl">Teams</h2>
          <button
            className="rounded-lg px-4 py-2 text-purple-500 hover:bg-slate-800 hover:text-white"
            type="button"
          >
            New team
          </button>
        </header>
        <div className="flex flex-col gap-4">
          <article className="rounded-lg bg-slate-800 p-4 hover:bg-purple-500">
            <header>
              <h3>DeLorean</h3>
              <div className="flex gap-4 text-white/60">
                <div>3 plans</div>
                <div>Admin</div>
              </div>
            </header>
          </article>
          <article className="rounded-lg bg-slate-800 p-4 hover:bg-purple-500">
            <header>
              <h3>.Net</h3>
              <div className="flex gap-4 text-white/60">
                <div>2 plans</div>
                <div>Contributor</div>
              </div>
            </header>
          </article>
          <article className="rounded-lg bg-slate-800 p-4 hover:bg-purple-500">
            <header>
              <h3>Team 1</h3>
              <div className="flex gap-4 text-white/60">
                <div>120 plans</div>
                <div>Contributor</div>
              </div>
            </header>
          </article>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
