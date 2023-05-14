import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { LoginModule } from 'src/login/login.module';

@Module({
    controllers: [PostController],
    providers: [PostService],
    imports: [LoginModule],
})
export class PostModule {}
