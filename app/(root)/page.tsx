import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions"
import { currentUser } from '@clerk/nextjs/server';

export default async function Home(){
  const result = await fetchPosts(1, 30)
  const user = await currentUser();
  
  
  return (
    <>
      <section className="flex flex-col mt-9">
        <h1 className="head-text text-left ml-6 text-2xl">Posts más Recientes:</h1>
        {result.posts.length === 0 ? (
          <p className="no-result">No posts available</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                comments={post.children}
                createdAt={post.createdAt}
                likes={post.likes}
                >
              </ThreadCard>
            ))}
          </>
        )}
      </section>
    </>
  )
}
