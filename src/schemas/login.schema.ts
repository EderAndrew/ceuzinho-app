import * as z from "zod"

const UserLogin = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export type LoginSchema = z.infer<typeof UserLogin>