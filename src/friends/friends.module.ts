import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { LoginModule } from '../login/login.module';

@Module({
    controllers: [FriendsController],
    providers: [FriendsService],
    imports: [LoginModule],
    exports: [FriendsService],
})
export class FriendsModule {}
