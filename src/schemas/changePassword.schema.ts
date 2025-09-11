import * as z from "zod"

const ChangePassword = z.object({
    email: z.email().optional,
    oldPwd: z.string().min(6),
    newPwd: z.string().min(6),
    repeatPwd: z.string().min(6)
})

export type PasswordSchema = z.infer<typeof ChangePassword>