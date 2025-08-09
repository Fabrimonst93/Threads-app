import * as z from "zod"

export const threadValidation = z.object({
    thread: z.string().nonempty().min(3, "Mínimo de 3 caracteres"),
    accountId: z.string()
})

export const commentValidation = z.object({
    thread: z.string().nonempty().min(3, "Mínimo de 3 caracteres"),
})