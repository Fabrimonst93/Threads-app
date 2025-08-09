import PostThread from "@/components/forms/PostThread"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"

async function Page() {
    const user = await currentUser()

    if (!user) return null

    const userInfo = fetchUser(user.id)
    
    if (!userInfo) return null

    return (
        <div className="m-10">

            <h1 className="head-text text-heading2-bold font-bold">
                Crear Post
            </h1>
            <PostThread userId={userInfo._id}/>
        </div>
    )
}
export default Page