import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions"
import { currentUser } from '@clerk/nextjs/server';

export default async function Home(){
  const result = await fetchPosts(1, 30)
  const user = await currentUser();
  
  
  return (
    <>
      <h1 className="head-text text-left"/>
      <section className="flex flex-col mt-9">
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
                community={post.communityId}
                comments={post.children}
                createdAt={post.createdAt}
                likes={post.likes}
                >
                <h2>{post.text}</h2>
                <p>Author: {post.author.name}</p>

              </ThreadCard>
            ))}
          </>
        )}
      </section>
    </>
  )
}
