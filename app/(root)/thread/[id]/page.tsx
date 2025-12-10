import ThreadCard from '@/components/cards/ThreadCard';
import Comment from '@/components/forms/Comments';
import { fetchThreadById } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) return null

    const user = await currentUser()
    if (!user) return null
   
    const userInfo = await fetchUser(user.id)
    if (!userInfo.onboarded) redirect('/onboarding')

    const thread = await fetchThreadById(id)
    if (!thread) return null;

    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    key={thread._id}
                    id= {thread._id}
                    currentUserId={user?.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likes={thread.likes}
                    />
            </div>

            <div className='m-7'>
                <Comment
                    threadId = {thread._id.toString()}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.parse(JSON.stringify(userInfo._id))}
                />
            </div>

            <div className='m7'>
                {thread.children && thread.children.map((childItem: any) => (
                    <ThreadCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user?.id}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.communityId}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        likes={childItem.likes}
                        isComment
                    />
                ))}
            </div>
        </section>
  )
}

export default page