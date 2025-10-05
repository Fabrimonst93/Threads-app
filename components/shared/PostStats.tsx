"use client"

import { likePost, unlikePost } from '@/lib/actions/thread.actions'
import { checkIsLiked } from '@/lib/utils'
import { set } from 'mongoose'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
  id: string // post id
  userId?: string// current user id
  likes?: string[]
  comments?: number
}

const PostStats = ({ id, likes, userId, comments }: Props) => {
    const [likesList, setLikesList] = React.useState<string[]>(likes ?? []);
    const [Liked, setLiked] = React.useState(checkIsLiked(id, likes ?? [], userId))


    const handleLike = () => {
      if (!userId) return

      if (Liked) {
        unlikePost( id, userId )
        setLiked(!Liked)
        setLikesList(prev => prev.filter(uid => uid !== userId))
      } else {
        likePost( id, userId )
        setLiked(!Liked)
        setLikesList(prev => [...prev, userId])
      }
    }
    
  return (
    <div className='flex gap-3.5 mt-2'>
        <div onClick={handleLike} className='flex items-center cursor-pointer'>
            <Image
                className='cursor-pointer object-contain'
                src= {Liked ?
                  "/heart-filled.svg":"/heart-gray.svg"}
                alt='Like'
                width={24}
                height={24}
                ></Image>
                {likesList.length && <p className='text-light-2 text-[12px]'>{likesList.length}</p>}

        </div>
        <Link href={`/thread/${id}`} className='flex items-center'>
            <Image
                className='curspr-pointer object-contain'
                src= "/reply.svg"
                alt='Like'
                width={24}
                height={24}
            >
            </Image>
            {comments && <p className='text-light-2 text-[12px]'>{comments}</p>}
        </Link>
    </div>
  )
}

export default PostStats