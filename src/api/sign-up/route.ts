import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,email,password}=await request.json()
        const existingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:'Username alrady taken'
            },{status:400})
        }
        const existingUserByEmail=await UserModel.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:'user already with email'
                },{status:400})
            }
            else{
                const hash=await bcrypt.hash(password,10);
                existingUserByEmail.password=hash
                existingUserByEmail.verifyCode=verifyCode
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
        }
        else{
            const hash=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1);
            const user=new UserModel({
                username,
                email,
                password:hash,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage:true,
                messages:[]
            })
            await user.save()
        }
        const emailResponse =await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message:'user registered. Please verify your email'
        },{status:201})
    } catch (error) {
        console.error(error)
        return Response.json(
            {
                success:false,
                message:'Error'
            },
            {
                status:500
            })
    }
}