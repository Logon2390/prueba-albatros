import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
export class BasePostDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(3, 50, { message: 'Title must be between 3 and 50 characters' })
  title!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(10, 255, { message: 'Body must be between 10 and 255 characters' })
  body!: string;

  @Expose()
  @IsString()
  author!: string;
}
