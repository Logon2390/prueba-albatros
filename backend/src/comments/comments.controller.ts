import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { ApiResponse } from '../common/responses/api.response';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) : ResponseCommentDto {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findByPostId(@Query('postId') postId: string) : Promise<ResponseCommentDto[]> {
    return this.commentsService.findByPostId(postId);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) : Promise<undefined> {
    return this.commentsService.remove(id);
  }
}
