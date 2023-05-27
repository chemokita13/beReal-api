import { HttpException, Injectable } from '@nestjs/common';
import BeFake from 'src/BeFake/BeFake';
import { BeFakeResponse } from 'src/BeFake/types/BeFakeResponse';
import { LoginService } from 'src/login/login.service';
import { APIresponse, PostData } from 'src/types/types';

@Injectable()
export class PostService {
    constructor(private readonly loginService: LoginService) {}
    // Gets a string and return an Uint8Array
    private JsonStringToUint8Array(jsonString: string): Uint8Array {
        var uint8array = new Uint8Array(jsonString.length);
        for (var i = 0; i < jsonString.length; i++) {
            uint8array[i] = jsonString.charCodeAt(i);
        }
        return uint8array;
    }
    async createPost(
        token: string,
        postData: string, // string<json:PostData>
        img1: Buffer,
        img2: Buffer,
    ): Promise<APIresponse> {
        try {
            // Convert string to PostData Object(json)
            const postObj: PostData = JSON.parse(postData);
            // Get tokens data and status from Object
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
            const post: BeFakeResponse = await bf.postUpload(
                img1,
                img2,
                postObj.resize,
                postObj.late,
                postObj.visibility,
                postObj.retakes,
                postObj.caption,
                postObj.taken_at,
                postObj.location,
            );
            if (!post.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Post not created',
                        data: post,
                    },
                    400,
                );
            }
            return {
                status: 201,
                message: 'Post created',
                data: post.data.data,
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
    async commentPost(
        token: string,
        postId: string,
        comment: string,
    ): Promise<APIresponse> {
        try {
            // Get tokens data and status from Object
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
            const commentResponse: BeFakeResponse = await bf.commentPost(
                postId,
                comment,
            );
            if (!commentResponse.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Comment not created',
                        data: commentResponse,
                    },
                    400,
                );
            }
            return {
                status: 201,
                message: 'Comment created',
                data: commentResponse.data,
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
