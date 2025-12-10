"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { threadValidation } from "@/lib/validations/thread"
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
import { createThread } from "@/lib/actions/thread.actions"
import { z } from "zod"
import { useAuth } from "@clerk/nextjs"
import { useOrganization } from "@clerk/nextjs"
import { fetchUser } from "@/lib/actions/user.actions"


interface Props {
  userId: string; // Este será el Mongo ID
}

const PostThread = ({ userId }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const { organization } = useOrganization()



  const form = useForm({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
      accountId: userId || ""
    }
  })



  const onSubmit = async (values: z.infer<typeof threadValidation>) => {

    if (!userId) {
      console.error("User not authenticated")
      return
    }


    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization? organization.id : null,
      path: pathname,
    })

    router.push("/")
  }

  const onInvalid = (errors: any) => {
    console.error(errors)}
  
  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Contenido
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Publicar
        </Button>
      </form>
    </Form>
  )
}

export default PostThread