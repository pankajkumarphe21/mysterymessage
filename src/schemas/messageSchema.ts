import { z } from "zod";

export const messageSchema=z.object({
    content:z
    .string()
    .min(10,{message:'Content should be atlest 10 characters'})
    .max(300)
})