import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { ResponsePostDto } from './dto/response-post.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationUtils, PaginatedResponse } from '../common/utils/pagination.utils';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<ResponsePostDto> {
    const post = new this.postModel(createPostDto);
    const savedPost = await post.save();
    return this.toDTO(savedPost);
  }

  async createBulk(createPostDtos: CreatePostDto[]): Promise<ResponsePostDto[]> {
    const posts = await this.postModel.insertMany(createPostDtos);
    return posts.map(post => this.toDTO(post));
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<ResponsePostDto>> {
    const { page, limit } = paginationDto;
    const { skip } = PaginationUtils.getPaginationParams(page, limit);

    const [posts, total] = await Promise.all([
      this.postModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments().exec(),
    ]);

    const result = PaginationUtils.buildPaginationResponse(posts.map(p => this.toDTO(p)), total, page, limit);
    return result;
  }

  async findOne(id: string): Promise<ResponsePostDto> {
    const post = await this.postModel.findById(id).exec() as PostDocument;
    return this.toDTO(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<ResponsePostDto> {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { returnDocument: 'after' })
      .exec() as PostDocument;

    return this.toDTO(post);
  }

  async remove(id: string): Promise<undefined> {
    await this.postModel.findByIdAndDelete(id).exec();
    return undefined;
  }

  private toDTO(post: PostDocument): ResponsePostDto {
    return plainToInstance(ResponsePostDto, post.toObject(), {excludeExtraneousValues: true});
  }
}
