import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import BeFake from 'src/BeFake/BeFake';
import { BeFakeResponse } from 'src/BeFake/types/BeFakeResponse';
import { APIresponse, tokenObj } from 'src/types/types';

@Injectable()
export class LoginService {
    constructor(private jwtService: JwtService) {} // Constructor with jwtService

    // Get tokens object and return token
    private async tokenize(tokenObj: tokenObj): Promise<string> {
        return await this.jwtService.signAsync(tokenObj);
    }

    // Get token and return token object
    public async getToken(token: string): Promise<APIresponse> {
        try {
            return {
                status: 200,
                message: 'Token generated',
                data: await this.jwtService.verifyAsync(token),
            };
        } catch (error) {
            return {
                status: 400,
                message: 'Token not generated',
                data: error,
            };
        }
    }

    async sendCode(body: { phone: string }): Promise<APIresponse> {
        try {
            const bf = new BeFake();
            const response: BeFakeResponse = await bf.sendOtpVonage(body.phone);
            if (response.done) {
                return {
                    status: 200,
                    message: 'OTP sent',
                    data: response.data,
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
                const tokenObj: tokenObj = bf.saveToken();
                return {
                    status: 200,
                    message: 'OTP verified',
                    data: {
                        tokenObj: await this.tokenize(tokenObj),
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

    async refreshToken(token): Promise<any> {
        const { status, data }: APIresponse = await this.getToken(token);
        if (status != 200) {
            return {
                status: 400,
                message: 'Token not generated',
                data: data,
            };
        }
        const oldTokenObj: tokenObj = data;
        const bf = new BeFake(oldTokenObj);
        const BfResponse: BeFakeResponse = await bf.refreshToken();
        if (!BfResponse.done) {
            return {
                status: 400,
                message: 'Token not refreshed',
                data: BfResponse.data,
            };
        }
        return {
            status: 200,
            message: 'Token refreshed',
            data: BfResponse.data,
        };
    }
}
