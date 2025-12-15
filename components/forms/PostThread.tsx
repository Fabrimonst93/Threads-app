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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { usePathname, useRouter } from "next/navigation"
import { createThread } from "@/lib/actions/thread.actions"
import { z } from "zod"

// 1. IMPORTAMOS LOS HOOKS DE REACT Y LA NUEVA ACCIÓN
import { useState, useEffect } from "react"
import { fetchUserCommunities } from "@/lib/actions/user.actions"

interface Props {
  userId: string
}

const PostThread = ({ userId }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  
  const [mongoCommunities, setMongoCommunities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCommunities = async () => {
        try {
            const communities = await fetchUserCommunities(userId)
            setMongoCommunities(communities)
        } catch (error) {
            console.error("Error cargando comunidades", error)
        } finally {
            setIsLoading(false)
        }
    }
    loadCommunities()
  }, [userId])



  const form = useForm({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
      accountId: userId || "",
      communityId: "personal",
    }
  })

  const onSubmit = async (values: z.infer<typeof threadValidation>) => {
    if (!userId) return

    const communityIdToSend = values.communityId === "personal" 
      ? null 
      : values.communityId || null

    await createThread({
      text: values.thread,
      author: userId,
      communityId: communityIdToSend, 
      path: pathname,
    })

    router.push("/")
  }

  const onInvalid = (errors: any) => console.error(errors)
  
  if (isLoading) return <div>Cargando opciones...</div>

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

        <FormField
          control={form.control}
          name='communityId'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Publicar en
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl className="bg-dark-3 border-dark-4 text-light-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona dónde publicar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-dark-3 border-dark-4 text-light-1">
                  
                  <SelectItem value="personal" className="cursor-pointer focus:bg-primary-500">
                    Mi Perfil (Personal)
                  </SelectItem>

                  {mongoCommunities.map((community) => (
                    <SelectItem 
                      key={community.id} 
                      value={community.id} // Aquí usamos el ID de Clerk guardado en Mongo
                      className="cursor-pointer focus:bg-primary-500"
                    >
                      {community.name}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500 cursor-pointer'>
          Publicar
        </Button>
      </form>
    </Form>
  )
}

export default PostThread