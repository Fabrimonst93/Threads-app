import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import CommunityButtons from './CommunityButtons'


interface Props {
  authorId: string
  authUserId: string
  name: string
  username: string
  imgUrl: string
  bio: string
  type: "User" | "Community"
  communityId?: string
  members?: any[]
  }

const ProfileHeader = (
    {authorId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type,
    communityId,
    members
}: Props
) => {
    
    const isMember = members?.some(
        (member: any) => member.id === authUserId
    )

    return (
        <div className='flex w-full flex-col justify-start'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='relative h-20 w-20 object-cover'>
                        <Image
                            src={imgUrl}
                            alt='profile image'
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className='rounded-full object-cover'
                        />
                    </div>

                    <div className='flex-1'>
                        <h2 className='text-left text-heading3-bold text-light-1'>{name}</h2>
                        <p className='text-base-medium text-light-3'>@{username}</p>
                    </div>
                </div>

                {type === 'Community' && communityId &&(
                    <CommunityButtons
                        authorId={authorId}
                        authUserId={authUserId}
                        communityId={communityId}
                        isMember={isMember}
                    />
                )}

                {authorId === authUserId && type === "User" &&(
                    <Link href={`/profile/edit`}>
                        <Button size='sm' className='h-12 community-card_btn hover:bg-dark-4 hover:cursor-pointer'>
                            Editar
                            <Image
                                src="/edit.svg"
                                alt='edit'
                                width={16}
                            height={16}
                            />
                        </Button>
                    </Link>
                )}
            </div>

            <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>
            <div className='mt-12 h-0.5 w-full bg-dark-4'></div>
        </div>
    )
}

export default ProfileHeader