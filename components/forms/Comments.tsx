"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { commentValidation } from "@/lib/validations/thread"
import { Button } from "@/components/ui/button"
import { Textarea } from "../ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import mongoose from 'mongoose';
import { Input } from "../ui/input"
import Image from "next/image"
import { createComment } from "@/lib/actions/thread.actions"


interface Props {
    threadId: string
    currentUserImg: string
    currentUserId: string
}
const Comment = ({threadId, currentUserImg, currentUserId}: Props) => {
const router = useRouter()
  const pathname = usePathname()
  const { userId } = useAuth()

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: ""
    }
  })



  const onSubmit = async (values: z.infer<typeof commentValidation>) => {

    if (!userId) {
      console.error("User not authenticated")
      return
    }
    console
    await createComment(threadId, values.thread, currentUserId, pathname)
    form.reset()
  }

  const onInvalid = (errors: any) => {
    console.error(errors)}
  

  return (
    <Form {...form}>
      <form
        className='comment-form'
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                <Image 
                    src={currentUserImg}
                    alt="Profile Image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className='border border-dark-4 rounded-lg'>
                <Input
                    type="text"
                    placeholder="Escriba un comentario"
                    className="no-focus text-light-1 outline-none"
                 {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Comentar
        </Button>
      </form>
    </Form>
  )
}

export default Comment