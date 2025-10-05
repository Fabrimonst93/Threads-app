import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import PostStats from '../shared/PostStats'

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
    communityId: {
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
    communityId,
    comments,
    createdAt,
    isComment,
    likes
} : props
) => {

  return (
    <article className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 m-4 mr-10 p-7"
      }`}>
        <div className='flex items-start justjustify-between'>
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
                    <div className='thread-card_bar'></div>
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
                    <div className={`${isComment && "mb-10 "}mt-5 flex flex-col gap-3`}>

                        <PostStats id={id.toString()} likes={likes} userId={currentUserId} comments={comments.length}/>

                        {isComment && comments.length > 0 &&(
                            <Link
                                href={`/thread/${id}`}
                                className='text-small-regular text-light-2 hover:underline'
                            >
                                <p className='mt-1 text-subtle-medium text-gray-1'>
                                    {comments.length} replies
                                </p>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </article>
  )
}

export default ThreadCard