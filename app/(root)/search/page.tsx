import UserCard from '@/components/cards/UserCard'
import Pagination from '@/components/shared/Pagination'
import Searchbar from '@/components/shared/Searchbar'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: params.q,
    pageNumber: params?.page ? + params.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className='text-heading2-bold text-light-1 mb-10 m-7'>Busqueda</h1>
      <Searchbar routeType='search' />

      <div className='mt-14 flex flex-col gap-9 m-7 p-6 rounded-xl bg-dark-4'>
        {result.users.length === 0 ? (
          <p className='no-result'>Sin Resultados</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path='search'
        pageNumber={params?.page ? +params.page : 1}
        isNext={result.isNext}
      />
    </section>
  )
}

export default page