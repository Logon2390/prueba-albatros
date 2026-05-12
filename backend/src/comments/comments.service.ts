import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../common/responses/api.response';
import { ResponseCommentDto } from './dto/response-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  create(createCommentDto: CreateCommentDto) : ApiResponse<ResponseCommentDto > {
    const comment = new this.commentModel(createCommentDto);
    return ApiResponse.success(this.toDTO(comment), 'Comment created successfully'); 
  }

  async findByPostId(postId: string) : Promise<ApiResponse<ResponseCommentDto[]>> {
    const comments = await this.commentModel.find({ postId }).exec();
    return ApiResponse.success(comments.map((comment) => this.toDTO(comment)), 'Comments found successfully');
  }

  async remove(id: string) : Promise<ApiResponse<void>> {
    await this.commentModel.findByIdAndDelete(id).exec();
    return ApiResponse.success(undefined, 'Comment removed successfully');
  }

  private toDTO(comment: CommentDocument) : ResponseCommentDto {
    return plainToInstance(ResponseCommentDto, comment.toObject(), {excludeExtraneousValues: true});
  }
}
