import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { env } from 'process';

@Module({
  imports: [
    MongooseModule.forRoot(env.DATABASE_URL || 'mongodb://localhost:27017'),
    PostsModule,
    CommentsModule
  ],
})
export class AppModule {}
