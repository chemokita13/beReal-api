import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';

@Module({
    controllers: [LoginController],
    providers: [LoginService],
    imports: [
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
        }),
    ],
    exports: [LoginService],
})
export class LoginModule {}
