import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class SignUpDTO {
    @IsNotEmpty({message: "Email is empty"})
    @IsEmail({}, { message: "email is invalid" })
    email: string

    @IsNotEmpty()
    @IsStrongPassword()
    password: string

    @IsNotEmpty()
    @IsStrongPassword()
    confirmPassword: string
}