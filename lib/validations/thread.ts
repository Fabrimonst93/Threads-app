import * as z from "zod"
import Community from "../models/community.model"

export const threadValidation = z.object({
    thread: z.string().nonempty().min(3, "Mínimo de 3 caracteres"),
    accountId: z.string(),
    communityId: z.string().optional(),
})

export const commentValidation = z.object({
    thread: z.string().nonempty().min(3, "Mínimo de 3 caracteres"),
})