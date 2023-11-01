import { Module } from '@nestjs/common';
import { RealmojisService } from './realmojis.service';
import { RealmojisController } from './realmojis.controller';
import { LoginModule } from 'src/login/login.module';

@Module({
    controllers: [RealmojisController],
    providers: [RealmojisService],
    imports: [LoginModule],
})
export class RealmojisModule {}
