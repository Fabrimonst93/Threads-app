import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import Searchbar from "@/components/shared/Searchbar"
import Pagination from "@/components/shared/Pagination"
import CommunityCard from "@/components/cards/CommunityCard"

import { fetchUser } from "@/lib/actions/user.actions"
import { fetchCommunities } from "@/lib/actions/community.actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  // Await searchParams before using
  const params = await searchParams

  const result = await fetchCommunities({
    searchString: params.q,
    pageNumber: params?.page ? +params.page : 1,
    pageSize: 25,
  })

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className='head-text m-5'>Comunidades</h1>
        <Link href="/create-community">
          <Button size='sm' className='m-5 community-card_btn bg-primary-500 hover:bg-dark-4 hover:cursor-pointer'>
            Crear comunidad
          </Button>
        </Link>
      </div>

      <div className='mt-5'>
        <Searchbar routeType='communities' />
      </div>

      <section className='m-9 flex flex-wrap gap-4 w-full'>
        {result.communities.length === 0 ? (
          <p className='no-result'>Sin resultado</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='communities'
        pageNumber={params?.page ? +params.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}

export default Page