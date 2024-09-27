import { IsDateString, IsString } from "class-validator";

export class CreateBookDto {

    @IsString()
    title: string

    @IsString()
    author: string

    @IsDateString()
    publicationDate: string

    @IsString()
    genre: string
}
