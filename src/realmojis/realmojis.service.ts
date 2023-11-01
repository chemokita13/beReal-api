import { HttpException, Injectable } from '@nestjs/common';
import BeFake from 'src/BeFake/BeFake';
import { BeFakeResponse } from 'src/BeFake/types/BeFakeResponse';
import { LoginService } from 'src/login/login.service';
import { APIresponse } from 'src/types/types';

@Injectable()
export class RealmojisService {
    constructor(private readonly loginService: LoginService) {}
    async getReactions(
        token: string,
        postId: string,
        userId: string,
    ): Promise<APIresponse> {
        const { status, data }: APIresponse = await this.loginService.getToken(
            token,
        );
        if (!postId || !userId) {
            throw new HttpException(
                {
                    status: 404,
                    message: 'PostId or UserId not provided',
                    data: data,
                },
                404,
            );
        }
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
        const realmojis: BeFakeResponse = await bf.getReactions(postId, userId);
        if (!realmojis.done) {
            throw new HttpException(
                {
                    status: 400,
                    message: 'Realmojis not fetched',
                    data: realmojis,
                },
                400,
            );
        }
        return {
            status: 200,
            message: 'Realmojis fetched successfully',
            data: realmojis,
        };
    }
    async reactToPost(
        postId: string,
        userId: string,
        mojiType: string,
        token: string,
    ): Promise<APIresponse> {
        const { status, data }: APIresponse = await this.loginService.getToken(
            token,
        );
        if (status != 200) {
            throw new HttpException(
                {
                    status: 401,
                    message: 'Token not generated',
                    data: data,
                },
                401,
            );
        }
        if (!postId || !userId || !mojiType) {
            throw new HttpException(
                {
                    status: 404,
                    message: 'PostId or UserId not provided',
                    data: data,
                },
                404,
            );
        }
        const bf: BeFake = new BeFake(data);
        const realmojis: BeFakeResponse = await bf.postRealmogi(
            postId,
            userId,
            mojiType,
        );
        if (!realmojis.done) {
            throw new HttpException(
                {
                    status: 400,
                    message: 'Realmojis not fetched',
                    data: realmojis,
                },
                400,
            );
        }
        return {
            status: 200,
            message: 'Realmoji posted successfully',
            data: realmojis.data,
        };
    }
}
