import Image from "next/image"
import Link from "next/link"

import { redirect } from "next/navigation"

import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const activity = await getActivity(userInfo._id)

  return (
    <>
      <h1 className='text-heading2-bold text-light-1 mb-10 m-7'>Actividad</h1>
      <section className='mt-8 flex flex-col gap-5 m-7'>
        {activity.length > 0 ? (
          <>
                      {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className='activity-card p-4'>
                  <Image
                    src={activity.author.image}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name}
                    </span>{" "}
                    respondió a tu post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>Todavía no hay actividad</p>
        )}
      </section>
    </>
  );
}

export default Page