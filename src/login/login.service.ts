import { Injectable } from '@nestjs/common';
import BeFake from 'src/BeFake/BeFake';
import { BeFakeResponse } from 'src/BeFake/types/BeFakeResponse';
import { APIresponse } from 'src/types/types';

@Injectable()
export class LoginService {
  async sendCode(body: { phone: string }): Promise<APIresponse> {
    try {
      const bf = new BeFake();
      const response: BeFakeResponse = await bf.sendOtpVonage(body.phone);
      if (response.done) {
        return {
          status: 200,
          message: 'OTP sent',
          data: {
            otpSesion: response.data,
          },
        };
      }
      return {
        status: 400,
        message: 'OTP not sent',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }

  async verifyCode(body: {
    code: string;
    otpSesion: string;
  }): Promise<APIresponse> {
    try {
      const bf = new BeFake();
      const response: BeFakeResponse = await bf.verifyOtpVonage(
        body.code,
        body.otpSesion,
      );
      if ((response.done = true)) {
        return {
          status: 200,
          message: 'OTP verified',
          data: {
            tokenObj: bf.saveToken(),
          },
        };
      }
      return {
        status: 400,
        message: 'OTP not verified',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }
}
