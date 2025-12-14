import Image from "next/image"

import { communityTabs } from "@/constants"

import UserCard from "@/components/cards/UserCard"
import ThreadsTab from "@/components/shared/ThreadsTab"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { fetchCommunityDetails } from "@/lib/actions/community.actions"
import { currentUser } from "@clerk/nextjs/server"

async function Page({ params }: { params: { id: string } }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return null

  
  const communityDetails = await fetchCommunityDetails(id)

  return (
    <section className='m-9'>
      <ProfileHeader
        authorId={communityDetails.createdBy.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        communityId={id}
        members={communityDetails.members}
        type='Community'
      /> 

      <div className='mt-9 w-full'>
        <Tabs defaultValue='threads' >
          <TabsList className='tab w-full'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {communityDetails.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails}
              accountType='Community'
            />
          </TabsContent>

          <TabsContent value='miembros' className='w-full text-light-1'>
            <section className='mt-6 flex flex-col gap-3'>
              {communityDetails.members.map((member: any) => (
                <div key={member.id} className='w-full bg-dark-3 p-4 rounded-lg'>
                  <UserCard
                    key={member.id}
                    id={member.id}
                    name={member.name}
                    username={member.username}
                    imgUrl={member.image}
                    personType='User'
                  />

                </div>
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default Page