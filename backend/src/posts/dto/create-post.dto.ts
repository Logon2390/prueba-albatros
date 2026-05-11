import { IsOptional, IsString, IsNotEmpty, Length, IsDateString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  id: string | undefined;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50, { message: 'Title must be between 3 and 50 characters' })
  title!: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 255, { message: 'Body must be between 10 and 255 characters' })
  body!: string;

  @IsNotEmpty()
  @IsString()
  author!: string;

  @IsOptional()
  @IsDateString()
  createdAt!: Date;

  @IsOptional()
  @IsDateString()
  updatedAt!: Date;
}
