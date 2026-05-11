import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  create(createCommentDto: CreateCommentDto) {
    const comment = new this.commentModel(createCommentDto);
    return comment.save();
  }

  findByPostId(postId: string) {
    const comments = this.commentModel.find({ postId }).exec();
    return comments;
  }

  remove(id: number) {
    this.commentModel.findByIdAndDelete(id).exec();
    return `This action removes a #${id} comment`;
  }
}
