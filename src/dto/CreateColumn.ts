import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class CreateColumnDTO {
    @IsNotEmpty()
    title: string;
}