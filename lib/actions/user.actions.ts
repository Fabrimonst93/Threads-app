"use server"

import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"
import Community from "../models/community.model"


interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}


export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
  }: Params
  ): Promise<void> {
      connectToDB()

    
    try {
        await User.findOneAndUpdate(
            {id:userId},
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            {upsert: true}
        )

        if (path === '/profile/edit'){
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
        
    }
}


export async function fetchUser(userId: string) {
  try {
    connectToDB()

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}


export async function fetchUserPosts(userId: string){
    try {
        connectToDB()

        const threads = await User.findOne({ id: userId }).populate({
        path: "threads",
        model: Thread,
        populate: [
          {
            path: "community",
            model: Community,
            select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
          },
          {
            path: "children",
            model: Thread,
            populate: {
                path: "author",
                model: User,
                select: "name image id",
            }
          }
        ]
        })
        return threads
    } catch (error: any){
        throw new Error(`Fallo al encontrar posts: ${error.message}` )
    }
}


export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}) {
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize
    const regex = new RegExp(searchString, "i")

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    }

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ]
    }

    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)
    const users = await usersQuery.exec()
    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext }
  } catch (error) {
    console.error("Error buscando usuarios:", error)
    throw error
  }
}


export async function getActivity(userId: string) {
  try {
    connectToDB()

    const userThreads = await Thread.find({ author: userId })
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children)
    }, [])
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    })

    return replies
  } catch (error) {
    console.error("Error al buscar actividad: ", error)
    throw error
  }
}


export async function likePostAdd(userId: string, postId: string) {
  try {
    connectToDB()
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error("Usuario no encontrado")

    user.likes = user.likes || []
    user.likes.push(postId)

    await user.save()
    console.log("Post likeado exitosamente")

  } catch (error) {
    console.error("Error al dar like: ", error)
    throw error
  }
}

export async function LikePostDelete(userId: string, postId: string) {
  try {
    connectToDB()
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error("Usuario no encontrado")

    user.likes = user.likes.filter((like: string) => like !== postId)
    await user.save()

  } catch (error) {
    console.error("Error al quitar like: ", error)
    throw error
  }
}