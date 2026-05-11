import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsOptional()
    id: string | undefined;

    @IsString()
    postId!: string;

    @IsString()
    name!: string;

    @IsString()
    email!: string;

    @IsString()
    body!: string;

    @IsOptional()
    @IsDateString()
    createdAt!: Date;
}
