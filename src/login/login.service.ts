import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  sendCode(body: { phone: string }): Promise<any> {
    throw new Error('Method not implemented.');
  }
  verifyCode(body: { phone: string; code: string }): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
