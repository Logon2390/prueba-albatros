import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { ApiResponse } from '../common/responses/api.response';
import { ResponsePostDto } from './dto/response-post.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationUtils, PaginatedResponse } from '../common/utils/pagination.utils';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<ApiResponse<ResponsePostDto>> {
    const post = new this.postModel(createPostDto);
    const savedPost = await post.save();
    return ApiResponse.success(this.toDTO(savedPost), 'Post created successfully');
  }

  async createBulk(createPostDtos: CreatePostDto[]): Promise<ApiResponse<ResponsePostDto[]>> {
    const posts = await this.postModel.insertMany(createPostDtos);
    return ApiResponse.success(posts.map(post => this.toDTO(post)), 'Posts created successfully');
  }

  async findAll(paginationDto: PaginationDto): Promise<ApiResponse<PaginatedResponse<ResponsePostDto>>> {
    const { page, limit } = paginationDto;
    const { skip } = PaginationUtils.getPaginationParams(page, limit);

    const [posts, total] = await Promise.all([
      this.postModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments().exec(),
    ]);

    const result = PaginationUtils.buildPaginationResponse(posts.map(p => this.toDTO(p)), total, page, limit);
    return ApiResponse.success(result, 'Posts retrieved successfully');
  }

  async findOne(id: string): Promise<ApiResponse<ResponsePostDto>> {
    const post = await this.postModel.findById(id).exec() as PostDocument;
    return ApiResponse.success(this.toDTO(post), 'Post retrieved successfully');
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<ApiResponse<ResponsePostDto>> {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { returnDocument: 'after' })
      .exec() as PostDocument;

    return ApiResponse.success(this.toDTO(post), 'Post updated successfully');
  }

  async remove(id: string): Promise<ApiResponse<undefined>> {
    await this.postModel.findByIdAndDelete(id).exec();
    return ApiResponse.success(undefined, 'Post deleted successfully');
  }

  private toDTO(post: PostDocument): ResponsePostDto {
    return plainToInstance(ResponsePostDto, post.toObject(), {excludeExtraneousValues: true});
  }
}
