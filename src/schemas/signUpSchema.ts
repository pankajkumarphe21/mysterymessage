import {z} from 'zod'

export const usernameValidation = z.string().min(2).max(20)

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email(),
    password:z.string().min(6,{message:'password must be atleast 6 characters'})
})