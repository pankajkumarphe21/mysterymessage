import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'pankaj.kumar.phe21@itbhu.ac.in',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {success:true,message:'mail sent'}
    } catch (error) {
        console.log(error)
        return {success:false,message:'Failed to sent mail'}
    }
}