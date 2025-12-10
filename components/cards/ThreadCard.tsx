import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import PostStats from '../shared/PostStats'
import Community from '@/lib/models/community.model'
import { formatDateString } from '@/lib/utils'
import { Button } from '../ui/button'
import { userValidation } from '@/lib/validations/user'
import DeleteButton from '../shared/DeleteButton'

interface props {
    id: string
    currentUserId: string | undefined
    parentId: string | null
    content: string
    author: {
        name: string
        image: string
        id: string
    }
    community: {
        id: string
        name: string
        image: string
    } | null
    comments: {
        author: {
            image: string
        }
    }[]
    createdAt: string
    isComment?: boolean
    likes: string[]
    children?: React.ReactNode
}


const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    comments,
    createdAt,
    isComment = false,
    likes
} : props
) => {
  const handleDelete = () => {
        if (!userValidation) return
    }


  return (
    
    <article className={`flex w-auto flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 m-4 mr-10 p-7"
      }`}>
        <div className='flex items-start justify-between'>
            <div className='flex flex-1 w-full flex-row gap-4'>
                <div className='flex flex-col items-center'>
                    <Link
                        href={`/profile/${author.id}`}
                        className='relative h-11 w-11'
                    >
                        <img
                            src={author.image}
                            alt="Profile Image"
                            className='rounded-full cursor-pointer'
                        />
                    </Link>
                    {comments?.length > 0 && <div className= 'thread-card_bar'/>}
                    {comments?.length > 0 && (
                              <div className='flex items-center'>
                                <Link href={`/thread/${id}`} className='flex items-center'>
                                
                                    {comments.slice(0, 3).map((comments, index) => (
                                    <Image
                                        key={index}
                                        src={comments.author.image}
                                        alt={`user_${index}`}
                                        width={28}
                                        height={28}
                                        className={`${
                                        index !== 0 && "-ml-4"
                                        } rounded-full object-cover`}
                                    />
                                    ))}
                                    {comments.length > 3 && (
                                        <p className='ml-1 text-subtle-medium text-gray-1'>
                                        +{comments.length-3}
                                    </p>
                                    )}
                                </Link>
                              </div>
                            )}
                </div>
                <div className=''>
                    <Link
                        href={`/profile/${author.id}`}
                        className='cursor-pointer text-base-semibold text-light-1 hover:underline'
                    >
                        {author.name}
                    </Link>
                    <p className='mt-2 text-small-regular text-light-2'>
                        {content}
                    </p>

                    <PostStats id={id.toString()} likes={likes} userId={currentUserId} comments={comments.length}/>

                    {!isComment && community && (
                            <div className='mt-5 ml-4 flex items-center'>
                                <p className='text-subtle-medium text-gray-1 mr-1'>
                                    {formatDateString(createdAt)}
                                </p>

                                <Link
                                    href={`/communities/${community.id}`}
                                    className="flex items-center hover:underline" // SOLUCIÓN: flex + items-center
                                >
                                    <span className='text-subtle-medium text-gray-1'>
                                        - Comunidad: {community.name}
                                    </span>
                                    <Image
                                        src={community.image}
                                        alt={community.name}
                                        width={14}
                                        height={14}
                                        className='ml-1 rounded-full object-cover'
                                    />
                                </Link>
                            </div>
                        )}
                         {/* Si no hay comunidad, solo mostramos la fecha */}
                        {!isComment && !community && (
                            <p className='mt-5 text-subtle-medium text-gray-1'>
                                {formatDateString(createdAt)}
                            </p>
                        )}
                </div>
            </div>
            {author.id === currentUserId && (
                <DeleteButton
                    threadId={JSON.stringify(id)}
                    currentUserId={currentUserId || ''}
                    authorId={author.id}              
                />
            )}
        </div>
    </article>
  )
}

export default ThreadCard