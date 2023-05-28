import { HttpException, Injectable } from '@nestjs/common';
import BeFake from 'src/BeFake/BeFake';
import { BeFakeResponse } from 'src/BeFake/types/BeFakeResponse';
import { LoginService } from 'src/login/login.service';
import { APIresponse } from 'src/types/types';

@Injectable()
export class FriendsService {
    constructor(private readonly loginService: LoginService) {}
    async getFeed(token: string): Promise<APIresponse> {
        try {
            const { status, data }: APIresponse =
                await this.loginService.getToken(token);
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
            const bf: BeFake = new BeFake(data);
            const feed = await bf.getFriendsFeed();
            return {
                status: 200,
                message: 'Feed generated',
                data: feed,
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

    async getFriends(token: string): Promise<APIresponse> {
        try {
            const { status, data }: APIresponse =
                await this.loginService.getToken(token);
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
            const bf: BeFake = new BeFake(data);
            const friends = await bf.getFriends();
            return {
                status: 200,
                message: 'Friends generated',
                data: friends,
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

    async getUserInfo(token: string) {
        try {
            const { status, data }: APIresponse =
                await this.loginService.getToken(token);
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
            const bf: BeFake = new BeFake(data);
            const userInfoResponse: BeFakeResponse = await bf.getUserInfo();
            if (!userInfoResponse.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'User info not found',
                        data: userInfoResponse.data,
                    },
                    400,
                );
            }
            return {
                status: 200,
                message: 'User info found',
                data: userInfoResponse.data,
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
