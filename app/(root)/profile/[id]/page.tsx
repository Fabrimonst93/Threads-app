import React from 'react'
import ThreadCard from '@/components/cards/ThreadCard';
import Comment from '@/components/forms/Comments';
import { fetchThreadById } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import Image from 'next/image';
import ThreadsTab from '@/components/shared/ThreadsTab';


async function page({params}: {params:{id:string}}) {

    const user = await currentUser()
    if (!user) return null
   
    const userInfo = await fetchUser(params.id)
    

    console.log('userInfo', userInfo.id)
    if (!userInfo.onboarded) redirect('/onboarding')
    
  
    return (
      <section>
        <div className='m-7'>
          <ProfileHeader
            accountId={userInfo.id}      // <-- profile being viewed
            authUserId={user.id}         // <-- current logged-in user
            name={userInfo.name}
            username={userInfo.username}
            imgUrl={userInfo.image}
            bio={userInfo.bio}
          />
          <div className='mt-9'>
            <Tabs defaultValue='threads' className='w-full'>
              <TabsList className='tab w-full'>
                {profileTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className='tab w-full' >
                    <Image
                      src={tab.icon}
                      alt={`${tab.label} icon`}
                      width={24}
                      height={24}
                      className='objext-contain'
                    />
                    <p >{tab.label}</p>
                    {tab.label === 'Threads' && (
                      <p className='ml-1 rounded-sm bg-light-4 px-x py-1 !text-tiny-medium text-light-2 w-8'>
                        {userInfo?.threads?.length}
                      </p>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {profileTabs.map((tab) => (
                <TabsContent key={`content-${tab.label}`} value={tab.value} className='w-full text-light-1'>
                  <ThreadsTab
                    currentUserId={user.id}
                    accountId={userInfo.id}
                    accountType="User"
                  >
                  </ThreadsTab>
                </TabsContent>
                ))}
            </Tabs>
          </div>
        </div>
      </section>
  )
}

export default page