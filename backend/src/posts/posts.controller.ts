import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponsePostDto } from './dto/response-post.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/utils/pagination.utils';

@Controller('posts')
@UseGuards(JwtGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto): Promise<ResponsePostDto> {
    return this.postsService.create(createPostDto);
  }

  @Post('/bulk')
  createBulk(@Body() createPostDtos: CreatePostDto[]): Promise<ResponsePostDto[]> {
    return this.postsService.createBulk(createPostDtos);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedResponse<ResponsePostDto>> {
    return this.postsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponsePostDto> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponsePostDto> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<undefined> {
    return this.postsService.remove(id);
  }
}
