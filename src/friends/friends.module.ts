import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
