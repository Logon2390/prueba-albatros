import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class CreateCommentDto {
    @Expose()
    @IsString()
    postId!: string;

    @Expose()
    @IsString()
    name!: string;

    @Expose()
    @IsString()
    @IsEmail()
    email!: string;

    @Expose()
    @IsString()
    body!: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    createdAt!: Date;
}
