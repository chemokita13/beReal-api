import { HttpException, Injectable } from '@nestjs/common';
import BeFake from 'src/BeFake/BeFake';
import { BeFakeResponse } from 'src/BeFake/types/BeFakeResponse';
import { LoginService } from 'src/login/login.service';
import { APIresponse, FriendsPostsEntity } from 'src/types/types';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class RealmojisService {
    constructor(
        private readonly loginService: LoginService,
        private readonly friendsService: FriendsService,
    ) {}
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
    async reactToAllPosts(
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
        if (!mojiType) {
            throw new HttpException(
                {
                    status: 404,
                    message: 'MojiType not provided',
                    data: data,
                },
                404,
            );
        }
        const friendsFeed: APIresponse = await this.friendsService.getFeed(
            token,
        );
        if (friendsFeed.status != 200) {
            throw new HttpException(
                {
                    status: 400,
                    message: 'Feed not fetched',
                    data: friendsFeed.data,
                },
                400,
            );
        }
        const posts: FriendsPostsEntity[] = friendsFeed.data.data.friendsPosts;
        const bf: BeFake = new BeFake(data);
        const realmojis: BeFakeResponse[] = [];
        posts.forEach(async (userPost) => {
            const userPosts = userPost.posts;
            userPosts.forEach(async (post) => {
                const realmoji: BeFakeResponse = await bf.postRealmogi(
                    post.id,
                    userPost.user.id,
                    mojiType,
                );
                realmojis.push(realmoji);
            });
        });
        return {
            status: 201,
            message: 'Realmojis posted successfully',
            data: realmojis,
        };
    }
}
