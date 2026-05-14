import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('comments')
@UseGuards(JwtGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) : Promise<ResponseCommentDto> {
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
