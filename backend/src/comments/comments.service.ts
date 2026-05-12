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

  create(createCommentDto: CreateCommentDto) : ResponseCommentDto {
    const comment = new this.commentModel(createCommentDto);
    return this.toDTO(comment);
  }

  async findByPostId(postId: string) : Promise<ResponseCommentDto[]> {
    const comments = await this.commentModel.find({ postId }).sort({ createdAt: -1 }).exec();
    return comments.map((comment) => this.toDTO(comment));
  }

  async remove(id: string) : Promise<undefined> {
    await this.commentModel.findByIdAndDelete(id).exec();
    return undefined;
  }

  private toDTO(comment: CommentDocument) : ResponseCommentDto {
    return plainToInstance(ResponseCommentDto, comment.toObject(), {excludeExtraneousValues: true});
  }
}
