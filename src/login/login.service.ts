import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import BeFake from 'src/BeFake/BeFake';
import getHeaders from 'src/BeFake/headers';
import { BeFakeResponse } from 'src/BeFake/types/BeFakeResponse';
import { APIresponse, tokenObj } from 'src/types/types';

@Injectable()
export class LoginService {
    constructor(private jwtService: JwtService) { } // Constructor with jwtService

    // Get tokens object and return token
    public async tokenize(tokenObj: tokenObj): Promise<string> {
        return await this.jwtService.signAsync(tokenObj);
    }

    // Get tokens object and return token
    public async tokenizeAll(tokenObj: any): Promise<string> {
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
            throw new HttpException(
                {
                    status: 400,
                    message: 'Token not generated',
                    data: error,
                },
                400,
            );
        }
    }

    public async getTokenInfo(token: string): Promise<APIresponse> {
        try {
            const { status, data }: APIresponse = await this.getToken(token);
            if (status != 200) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Token not generated',
                        data: data,
                    },
                    400,
                );
            }
            return {
                status: 200,
                message: 'Token generated',
                data: { data: data, headers: getHeaders() },
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: 400,
                    message: 'Token not generated',
                    data: error,
                },
                400,
            );
        }
    }

    public async sendCode(body: { phone: string }): Promise<APIresponse> {
        // try {
        const bf = new BeFake();
        const response: BeFakeResponse = await bf.sendOtpCloud(body.phone);
        console.log(body.phone);
        if (response.done) {
            if (response.data.otpSession.error) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'OTP not sent',
                        data: response.data,
                    },
                    400,
                );
            } else {
                return {
                    status: 201,
                    message: 'OTP sent',
                    data: response.data,
                };
            }
        }
        throw new HttpException(
            {
                status: 400,
                message: 'OTP not sent',
                data: response.data,
            },
            400,
        );
        // } catch (error) {
        //     console.log(error.data)
        //     throw new HttpException(
        //         {
        //             status: 400,
        //             message: 'OTP not sent',
        //             data: error.data,
        //         },
        //         400,
        //     );
        // }
    }

    public async sendVonageCode(body: { phone: string }): Promise<APIresponse> {
        try {
            const bf = new BeFake();
            const response: BeFakeResponse = await bf.sendOtpVonage(body.phone);
            console.log(response);
            if (response.done) {
                return {
                    status: 201,
                    message: 'OTP sent',
                    data: response.data,
                };
            }
            throw new Error(response.data || response.msg);
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    status: 400,
                    message: 'OTP not sent',
                    data: error.data,
                },
                400,
            );
        }
    }

    public async verifyVonageCode(body: {
        code: string;
        otpSession: string;
    }): Promise<APIresponse> {
        try {
            const bf = new BeFake();
            const response: BeFakeResponse = await bf.verifyOtpVonage(
                body.code,
                body.otpSession,
            );

            if (response.done) {
                const tokenObj: tokenObj = bf.saveToken();
                return {
                    status: 201,
                    message: 'OTP verified',
                    data: {
                        token: await this.tokenize(tokenObj),
                    },
                };
            }
            throw new HttpException(
                {
                    status: 400,
                    message: 'OTP not verified',
                    data: response.data,
                },
                400,
            );
        } catch (error) {
            throw new HttpException(
                {
                    status: 500,
                    message: 'Internal server error',
                    data: error,
                },
                500,
            );
        }
    }

    public async verifyCode(body: {
        code: string;
        otpSession: string;
    }): Promise<APIresponse> {
        try {
            const bf = new BeFake();
            const response: BeFakeResponse = await bf.verifyOtpCloud(
                body.code,
                body.otpSession,
            );

            if (response.done) {
                const tokenObj: tokenObj = bf.saveToken();
                return {
                    status: 201,
                    message: 'OTP verified',
                    data: {
                        token: await this.tokenize(tokenObj),
                    },
                };
            }
            throw new HttpException(
                {
                    status: 400,
                    message: 'OTP not verified',
                    data: response.data,
                },
                400,
            );
        } catch (error) {
            throw new HttpException(
                {
                    status: 500,
                    message: 'Internal server error',
                    data: error,
                },
                500,
            );
        }
    }

    public async refreshToken(token: string): Promise<any> {
        try {
            const { status, data }: APIresponse = await this.getToken(token);
            if (status != 200) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Token not generated',
                        data: data,
                    },
                    400,
                );
            }
            const oldTokenObj: tokenObj = data;
            const bf = new BeFake(oldTokenObj);
            await bf.firebaseRefreshTokens();
            const refreshTokensResponse: BeFakeResponse =
                await bf.refreshTokens();
            if (!refreshTokensResponse.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Token not refreshed',
                        data: refreshTokensResponse.data,
                    },
                    400,
                );
            }
            const tokenObj: tokenObj = bf.saveToken();
            return {
                status: 201,
                message: 'Token refreshed',
                data: {
                    token: await this.tokenize(tokenObj),
                },
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: 500,
                    message: 'Internal server error',
                    data: error,
                },
                500,
            );
        }
    }
}
