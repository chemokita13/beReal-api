import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { FriendsModule } from './friends/friends.module';

@Module({
    imports: [LoginModule, PostModule, FriendsModule, ConfigModule.forRoot()],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
