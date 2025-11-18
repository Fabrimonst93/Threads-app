import { fetchUser, fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react'
import ThreadCard from '../cards/ThreadCard';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';


interface Props {
    currentUserId: string;
    accountId: string;
    accountType: 'User' | 'Community';
}
const ThreadsTab = async ({currentUserId, accountId, accountType}: Props) => {
    let results: any

    if (accountType === "Community") {
        results = await fetchCommunityPosts(accountId)
    } else {
        results = await fetchUserPosts(accountId)
    }

    if (!results) redirect('/')

    
    return (
        <section className='mt-9 flex flex-col'>
            {results.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                            accountType === "User"
                            ? { name: results.name, image: results.image, id: results.id }
                            : { name: thread.author.name, image: thread.author.image, id: thread.author.id}
                        }
                    community={thread.community?.id}
                    comments={thread.children}
                    createdAt={thread.createdAt}
                    likes={thread.likes}
                ></ThreadCard>
            ))}
        </section>
    )
}

export default ThreadsTab