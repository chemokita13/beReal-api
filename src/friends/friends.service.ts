import { Injectable } from '@nestjs/common';
import BeFake from 'src/BeFake/BeFake';
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
                return {
                    status: 400,
                    message: 'Token not generated',
                    data: data,
                };
            }
            const bf: BeFake = new BeFake(data);
            const feed = await bf.getFriendsFeed();
            return {
                status: 200,
                message: 'Feed generated',
                data: feed,
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Internal server error',
                data: error,
            };
        }
    }

    async getFriends(token: string): Promise<APIresponse> {
        try {
            const { status, data }: APIresponse =
                await this.loginService.getToken(token);
            if (status != 200) {
                return {
                    status: 400,
                    message: 'Token not generated',
                    data: data,
                };
            }
            const bf: BeFake = new BeFake(data);
            const friends = await bf.getFriends();
            return {
                status: 200,
                message: 'Friends generated',
                data: friends,
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
