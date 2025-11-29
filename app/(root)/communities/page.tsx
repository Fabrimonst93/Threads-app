import { redirect } from "next/navigation"

import Searchbar from "@/components/shared/Searchbar"
import Pagination from "@/components/shared/Pagination"
import CommunityCard from "@/components/cards/CommunityCard"

import { fetchUser } from "@/lib/actions/user.actions"
import { fetchCommunities } from "@/lib/actions/community.actions"
import { currentUser } from "@clerk/nextjs/server"


async function Page(){
  
}

export default Page