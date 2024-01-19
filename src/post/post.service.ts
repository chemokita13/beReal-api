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
        const uint8array = new Uint8Array(jsonString.length);
        for (let i = 0; i < jsonString.length; i++) {
            uint8array[i] = jsonString.charCodeAt(i);
        }
        return uint8array;
    }
    async createPost(
        token: string,
        postData: PostData, // string<json:PostData>
        img1: Buffer,
        img2: Buffer,
    ): Promise<APIresponse> {
        try {
            // Convert string to PostData Object(json)
            const postObj: PostData = postData;
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
                data: post.data,
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
        userId: string,
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
                userId,
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
    async deletePostComment(
        token: string,
        postId: string,
        commentId: string,
    ): Promise<APIresponse> {
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
            const deleteCommentResponse: BeFakeResponse =
                await bf.deleteComment(postId, commentId);
            if (!deleteCommentResponse.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Comment not deleted',
                        data: deleteCommentResponse,
                    },
                    400,
                );
            }
            return {
                status: 201,
                message: 'Comment deleted',
                data: deleteCommentResponse.data,
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

    //* Create post by steps
    async getData(token: string): Promise<APIresponse> {
        try {
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
            const response: BeFakeResponse = await bf.getUploadUrl();
            if (!response.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Post not created',
                        data: response,
                    },
                    400,
                );
            }
            // const dataToToken = response.data.paths;
            // const tokenized: string = await this.loginService.tokenize(
            //     dataToToken,
            // );
            // const dataToReturn = {
            //     firstRequest: response.data.firstRequest,
            //     secondRequest: response.data.secondRequest,
            //     token: tokenized,
            // };
            const tokenizePrimary: string = await this.loginService.tokenizeAll(
                {
                    urlInfo: response.data.firstRequest,
                },
            );
            const tokenizeSecondary: string =
                await this.loginService.tokenizeAll({
                    urlInfo: response.data.secondRequest,
                });
            const tokenizeThird: string = await this.loginService.tokenizeAll({
                paths: response.data.paths,
            });
            const dataToReturn = {
                firstPhotoToken: tokenizePrimary,
                secondPhotoToken: tokenizeSecondary,
                postDataToken: tokenizeThird,
            };
            return {
                status: 201,
                message: 'Post created',
                data: dataToReturn,
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
    async makeRequest(
        token: string,
        tokenData: string,
        photo: Buffer,
        resize: string,
    ) {
        try {
            // pass resize string to boolean
            const resizeBool: boolean = resize === 'true' ? true : false;
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
            const unTokenize: APIresponse = await this.loginService.getToken(
                tokenData,
            );
            if (unTokenize.status != 200) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Token post not generated',
                        data: unTokenize.data,
                    },
                    400,
                );
            }
            const bf: BeFake = new BeFake(data);
            const response: BeFakeResponse = await bf.makeRequest(
                unTokenize.data.urlInfo.url,
                unTokenize.data.urlInfo.headers,
                photo,
                resizeBool,
            );
            if (!response.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Post not created',
                        data: response,
                    },
                    400,
                );
            }
            return {
                status: 201,
                message: 'Post created',
                data: response.data,
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
    async postPhoto(token: string, postObj: PostData, tokenData: string) {
        try {
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
            const unTokenize: APIresponse = await this.loginService.getToken(
                tokenData,
            );
            if (unTokenize.status != 200) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Token post not generated',
                        data: unTokenize.data,
                    },
                    400,
                );
            }
            const bf: BeFake = new BeFake(data);
            const response: BeFakeResponse = await bf.postPhoto(
                postObj.late,
                postObj.visibility,
                postObj.retakes,
                [1500, 2000],
                [1500, 2000],
                unTokenize.data.paths.primaryPath,
                unTokenize.data.paths.secondaryPath,
                postObj.caption,
                postObj.taken_at,
                postObj.location,
            );
            if (!response.done) {
                throw new HttpException(
                    {
                        status: 400,
                        message: 'Post not created',
                        data: response,
                    },
                    400,
                );
            }
            return {
                status: 201,
                message: 'Post created',
                data: response.data,
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

/**
/// Get tokens data and status from Object
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
 */
