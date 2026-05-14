import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { env } from 'process';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(env.DATABASE_URL || 'mongodb://mongo:27017/prueba-albatros'),
    PostsModule,
    CommentsModule,
    AuthModule
  ],
})
export class AppModule {}
