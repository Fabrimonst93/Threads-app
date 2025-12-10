"use server"

import Thread from "../models/thread.model"
import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import { revalidatePath } from "next/cache"
import Page from '../../app/(auth)/onboarding/page'
import path from "path"
import { auth } from "@clerk/nextjs/server"
import { likePostAdd, LikePostDelete } from "./user.actions"
import Community from "../models/community.model"


interface Params {
    text: string
    author: string
    communityId: string | null
    path: string
}


export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDB()


    if (!author) throw new Error("Local user not found")
    

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    )

    const createdThread = await Thread.create({
      text,
      author: author, // Use the local user's ObjectId, not Clerk ID
      community: communityIdObject,
    })

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    })

    await Community.findByIdAndUpdate(communityIdObject?._id, {
      $push: { threads: createdThread._id }
    })

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`)
  }
}

export async function deletePost(threadId: string) {
  try {
    connectToDB()

    const mainThread = await Thread.findById(threadId).populate("author community")

    if (!mainThread) {
      throw new Error("Thread no encontrado")
    }

    await Thread.findByIdAndDelete(threadId)

    await User.updateOne(
      { _id: mainThread.author._id },
      { 
        $pull: { 
          threads: mainThread._id
        } 
      }
    )

    if (mainThread.community) {
      await Community.updateOne(
        { _id: mainThread.community._id },
        { $pull: { threads: mainThread._id } }
      )
    }

    await Thread.deleteMany({ parentId: threadId })

    if (mainThread.parentId) {
        await Thread.updateOne(
            { _id: mainThread.parentId },
            { $pull: { children: mainThread._id } }
        )
    }

    alert("Eliminado correctamente")

  } catch (error: any) {
    throw new Error(`Error al borrar el thread: ${error.message}`)
  }
}

export async function fetchPosts(PageNumber: number = 1, PageSize: number = 20) {
    connectToDB()
    try {

        const skipAmount = (PageNumber - 1) * PageSize

        const postsQuery = await Thread
        .find({parentId: { $in: [null, undefined]}})
        .sort({createdAt: "desc"})
        .skip(skipAmount)
        .limit(PageSize)
        .populate({path: "author", model: User})
        .populate({path: "community", model: Community})
        .populate({path: "children",
            populate: {
                path: "author",
                model: User,
                select: "_id name parentedId image"
        }})

        const totalPosts = await Thread.countDocuments({parentId: { $in: [null, undefined]}})

        const posts = postsQuery

        const isNext = totalPosts > skipAmount + posts.length

        return {posts, isNext}
        
    } catch (error) {
        throw Error(error as string)
    }
}

export async function fetchThreadById(id: string) {
    connectToDB()
    
    try {
        const thread = await Thread.findById(id)
        .populate({
            path: "author",
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: "community",
            model: Community,
            select: "_id id name image",
        })
        .populate({
            path: "children",
            populate: [
                {
                    path: "author",
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        })
        
        return thread
        
    } catch (error) {
        throw Error(error as string)
    }
}

export async function createComment(
    threadId: string,
    commentText: string,
    userId: string, // This is the Clerk user id
    path: string
) {
    connectToDB()
    
    try {
        // Find the local user by Clerk ID
        const localUser = await User.findOne({ clerkId: userId.replace(/"/g, "") })
        if (!localUser) throw new Error("Local user not found")
        console.log("Local User:", localUser)

        const originalThread = await Thread.findById(threadId)
        console.log("Original Thread:", originalThread)
        if (!originalThread) throw new Error("Post original no encontrado")

        const commentThread = new Thread({
            text: commentText,
            author: userId, // Use the local user's ObjectId
            parentId: threadId,
        })
        console.log("Creating comment:", commentThread)
        
        const savedComment = await commentThread.save()
        
        originalThread.children.push(savedComment._id)
        await originalThread.save()

        revalidatePath(path)
    }
    catch (error: any) {
        console.log("Local User:", userId)
        throw new Error(`Error al crear comentario: ${error.message}`)
    }
}

export async function likePost(
    threadId: string,
    userId: string
) {
    connectToDB()

    try {
        // Find the local user by Clerk ID
        const localUser = await User.findOne({ clerkId: userId.replace(/"/g, "") })
        if (!localUser) throw new Error("Local user not found")


        const thread = await Thread.findById(threadId)
        if (!thread) throw new Error("Post original no encontrado")

        likePostAdd(userId, threadId)
        thread.likes.push(userId)
        await thread.save()
        console.log("Comentario likeado exitosamente")

    }
    catch (error: any) {
        throw new Error(`Error al crear comentario: ${error.message}`)
    }
}

export async function unlikePost(
    threadId: string,
    userId: string
){
    connectToDB()

    try {
        // Find the local user by Clerk ID
        const localUser = await User.findOne({ clerkId: userId.replace(/"/g, "") })
        if (!localUser) throw new Error("Local user not found")

        const thread = await Thread.findById(threadId)
        if (!thread) throw new Error("Post original no encontrado") 
        thread.likes = thread.likes.filter((like: { toString: () => any }) => like.toString() !== userId.toString())
        LikePostDelete(userId, threadId)
        await thread.save()
    }
    catch (error: any) {
        throw new Error(`Error al crear comentario: ${error.message}`)
    }
}