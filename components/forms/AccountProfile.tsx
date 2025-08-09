"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { array, z } from "zod"
import { userValidation } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import { Textarea } from "../ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { isBase64Image } from "@/lib/utils"
import { UseUploadthingProps } from "@uploadthing/react"
import { useUploadThing } from "@/lib/uploadthing"
import { updateUser } from "@/lib/actions/user.actions"
import { usePathname, useRouter } from "next/navigation"


interface props {
    user: {
        id: string
        objectid: string
        username: string
        name: string
        bio: string 
        image: string
    }
    btnTitle: string
}

const AccountProfile = ({ user, btnTitle }: props) => {

  const router = useRouter()
  const pathname = usePathname()
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing("media")

  const form = useForm({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    }
  })

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault()

    const fileReader = new FileReader()
  
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      setFiles(Array.from(e.target.files))
      
      if (!file.type.includes("image")) return
      
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || ""
        
        fieldChange(imageDataUrl)
      }
      
      fileReader.readAsDataURL(file)
    }
  }

  const onInvalid = (errors: any) => {
    console.error(errors)}

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    const blob = values.profile_photo
    const hasImageChanged = isBase64Image(blob)

    if (hasImageChanged){
      const imgRes = await startUpload(files)

      if (imgRes && imgRes[0].ufsUrl){
        values.profile_photo = imgRes[0].ufsUrl 
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname 
    })


    if (pathname === "/profile/edit"){
      router.back()
    } else {
      router.push("/")
    }
  }



  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label h-24 w-24">
                {field.value? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ):(
                  <Image
                    src="/profile.svg"
                    alt="profile photo"
                    width={40}
                    height={40}
                    priority
                    className="rounded-full object-contain"
                  />
                )}
              </FormLabel>

              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image"
                  placeholder="Seleccione una imagen"
                  className="account-form_image-input"
                  onChange={(e)=> handleImage(e, field.onChange)}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Nombre
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  placeholder="Ingrese un nombre"
                  className="account-form_input no-focus"{...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Nombre de usuario
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  placeholder="Ingrese un nombre de usuario"
                  className="account-form_input no-focus"{...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start w-full">
              <FormLabel className="text-base-semibold text-light-2 ">
                Biografía
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={10}
                  placeholder="Introduzca una biografia"
                  className="account-form_input no-focus"{...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <Button type="submit">Aceptar</Button>
      </form>
    </Form>
  )
}

export default AccountProfile