"use client"

import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { deletePost } from '@/lib/actions/thread.actions'


interface Props {
    threadId: string;
    currentUserId: string;
    authorId: string;
}

const DeleteButton = ({ threadId, currentUserId, authorId }: Props) => {
    const handleDelete = () => {
        const confirmed = window.confirm("¿Seguro que quieres eliminar esto? No se puede deshacer.");
        if (!confirmed) return

        deletePost(JSON.parse(threadId))
    }

    return (
        <Button
            className='ml-4 p-2 bg-dark-2 hover:bg-dark-4  hover:cursor-pointer'
            onClick={handleDelete}
        >
            <Image
                src="/delete.svg"
                alt= "Delete"
                width={20}
                height={20}
                className='rounded-full object-cover'
            />
        </Button>
    )
}

export default DeleteButton