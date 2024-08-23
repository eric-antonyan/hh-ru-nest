import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class AddCommentDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    content: string;

    @IsNumber()
    @IsNotEmpty()
    cardId: number;
}