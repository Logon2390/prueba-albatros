import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  create(createPostDto: CreatePostDto) {
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  findAll() {
    return this.postModel.find().exec();
  }

  findOne(id: string) {
    return this.postModel.findById(id).exec();
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { returnDocument: 'after' })
      .exec();
  }

  remove(id: string) {
    this.postModel.findByIdAndDelete(id).exec();
    return `This action removes a #${id} post`;
  }
}
