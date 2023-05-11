import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { PostModule } from './post/post.module';
import { FriendsModule } from './friends/friends.module';

@Module({
    imports: [LoginModule, PostModule, FriendsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
