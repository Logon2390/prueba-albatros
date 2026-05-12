import { Expose, Transform } from 'class-transformer';
import { BasePostDto } from './base-post.dto';

export class ResponsePostDto extends BasePostDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id!: string;

  @Expose()
  createdAt!: Date;
  
  @Expose()
  updatedAt!: Date;
}
