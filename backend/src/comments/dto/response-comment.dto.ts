import { CreateCommentDto } from './create-comment.dto';
import { Expose, Transform } from 'class-transformer';

export class ResponseCommentDto extends CreateCommentDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id!: string;
}
