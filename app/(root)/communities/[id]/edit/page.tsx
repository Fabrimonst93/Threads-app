import AccountProfile from "@/components/forms/AccountProfile"
import { fetchCommunityDetails } from "@/lib/actions/community.actions"


interface Props {
  params: Promise<{ id: string }>
}

async function Page({ params }: Props) {
const { id } = await params;

    const userInfo = await fetchCommunityDetails(id)
    
    const userData = {
        id: userInfo?._id?.toString(),
        objectid: userInfo?._id?.toString(), 
        username: userInfo?.username,
        name: userInfo?.name,
        bio: userInfo?.bio || "", 
        image: userInfo?.image,
    }

    return (       
        <main className="mx-auto flex flex-col max-w-3xl justify-start px-10 py-20">
            <h1 className="head-text text-heading2-bold font-bold">
                Editar comunidades
            </h1>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile
                    user={userData}
                    type="community"
                    communityId={userInfo?.id?.toString()}
                />
            </section>
        </main>
    )
}

export default Page