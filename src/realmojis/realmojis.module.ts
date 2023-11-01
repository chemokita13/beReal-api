import { Module } from '@nestjs/common';
import { RealmojisService } from './realmojis.service';
import { RealmojisController } from './realmojis.controller';
import { LoginModule } from 'src/login/login.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
    controllers: [RealmojisController],
    providers: [RealmojisService],
    imports: [LoginModule, FriendsModule],
})
export class RealmojisModule {}
