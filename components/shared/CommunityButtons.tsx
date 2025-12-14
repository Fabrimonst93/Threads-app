"use client"

import React from 'react'
import { addMemberToCommunity, removeUserFromCommunity } from '@/lib/actions/community.actions'
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'


interface Props {
    authorId: string
    authUserId: string
    communityId: string
    isMember?: boolean
}

const CommunityButtons = ({ authorId, authUserId, communityId, isMember }: Props) => {

    const router = useRouter()

    const handleJoinCommunity = async () => {
        addMemberToCommunity(communityId, authUserId)
        router.refresh()
    }

    const handleLeaveCommunity = async () => {
        removeUserFromCommunity(communityId, authUserId)
        router.refresh()
    }

    return (
        <div className="flex items-center gap-3">
            {authorId === authUserId && (
                <Link href={`/communities/${communityId}/edit`}>
                    <Button size='sm' className='h-12 community-card_btn hover:bg-dark-4 hover:cursor-pointer'>
                        Editar
                        <Image
                            src='/edit.svg'
                            alt='edit icon'
                            width={16}
                            height={16}
                            className='mr-2'
                        />
                    </Button>
                </Link>
            )}

            {isMember ? (
                <Button size='sm' onClick={handleLeaveCommunity} className='h-12 community-card_btn hover:bg-dark-4 hover:cursor-pointer'>
                    Abandonar
                </Button>
            ) : (
                <Button size='sm' onClick={handleJoinCommunity} className='h-12 community-card_btn hover:bg-dark-4 hover:cursor-pointer'>
                    Ingresar
                </Button>
            )}
        </div>
    )
}

export default CommunityButtons