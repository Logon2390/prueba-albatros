import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponse } from '../common/responses/api.response';
import { Post as PostModel } from './schemas/post.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto): Promise<ApiResponse<PostModel>> {
    return this.postsService.create(createPostDto);
  }

  @Post('/bulk')
  createBulk(@Body() createPostDtos: CreatePostDto[]): Promise<ApiResponse<PostModel[]>> {
    return this.postsService.createBulk(createPostDtos);
  }

  @Get()
  findAll(): Promise<ApiResponse<PostModel[]>> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiResponse<PostModel>> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ApiResponse<PostModel>> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ApiResponse<undefined>> {
    return this.postsService.remove(id);
  }
}
