import { Controller } from '@nestjs/common';
import { LoginService } from './login.service';
import { Post, Body } from '@nestjs/common';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/send-code')
  SendCode(@Body() body: { phone: string }): Promise<any> {
    return this.loginService.sendCode(body);
  }

  @Post('/verify')
  VerifyCode(@Body() body: { phone: string; code: string }): Promise<any> {
    return this.loginService.verifyCode(body);
  }
}
