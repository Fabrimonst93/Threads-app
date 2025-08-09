import AccountProfile from "@/components/forms/AccountProfile"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


async function Page() {
    const user = await currentUser()
    if (!user) return null

    const userInfo = await fetchUser(user.id)
    if (userInfo?.onboarded) redirect("/")

    const userData = {
        id: user?.id,
        objectid: userInfo?._id,
        username: userInfo ? user?.username : userInfo?.username,
        name: userInfo ? user?.firstName : userInfo?.name ?? "",
        bio: userInfo?.bio ? userInfo : "",
        image: userInfo ? user?.imageUrl : userInfo?.image,
    };
    return (
        <main className="mx-auto flex flex-col max-w-3x1 justify-start px-10 py-20">
            <h1 className="head-text text-heading2-bold font-bold">
                Onboarding
            </h1>
            <p className="mt-3 text-base-regular text-light-2">Porfavor complete su perfil para continuar</p>
            <section className="mt-9 bg-dark-2 p-10">
                
                <AccountProfile
                    user={userData}
                    btnTitle="Continuar"
                />
            </section>
        </main>
    )
}

export default Page