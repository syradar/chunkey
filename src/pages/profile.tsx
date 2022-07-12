import type { NextPage } from 'next'
// import { trpc } from '../utils/trpc'

// const Profile: NextPage = ({
//   user,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
//   return (
//     <div className="">
//       <h1>Profile for {user.name}</h1>
//       <div>user Profile</div>
//     </div>
//   )
// }
const Profile: NextPage = () => {
  return (
    <div className="">
      <h1>Profile for </h1>
      <div>user Profile</div>
    </div>
  )
}

export default Profile

// export const getServerSideProps: GetServerSideProps = async ({ res }) => {
//   const session = trpc.useQuery(['auth.getSession'])

//   if (!session || !res || !session.data?.user) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: { user: session.data.user },
//   }
// }
