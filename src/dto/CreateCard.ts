import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCardDTO {
    @IsNotEmpty()
    @IsNumber()
    columnId: string;
}