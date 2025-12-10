import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';



interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type: "User" | "Community";
  }

const ProfileHeader = (
    {accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type
}: Props
) => {



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

                <Link href={`/profile/edit`}>
                    <Button size='sm' className='h-12 community-card_btn hover:bg-dark-4 hover:cursor-pointer'>
                        <Image
                            src="/edit.svg"
                            alt='edit'
                            width={24}
                            height={24}
                        />
                    </Button>
                </Link>
                
            </div>

            <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>
            <div className='mt-12 h-0.5 w-full bg-dark-4'></div>
        </div>
    )
}

export default ProfileHeader