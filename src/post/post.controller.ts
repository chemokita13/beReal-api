import {
    Body,
    Controller,
    Delete,
    HttpException,
    Post,
    Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { APIresponse, PostData } from 'src/types/types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    ApiExtraModels,
    ApiHeader,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}
    /// I dont know why, but that does not work in swagger api
    @ApiExtraModels(PostData)
    @ApiParam({
        name: 'img1',
        description: 'Image 1',
        type: 'file',
        required: true,
    })
    @ApiParam({
        name: 'img2',
        description: 'Image 2',
        type: 'file',
        required: true,
    })
    @ApiParam({
        name: 'post data',
        description: 'Post data',
        type: 'string',
        required: true,
        schema: {
            description: 'PostData see it scrolling down',
        },
    })
    @ApiOperation({
        summary: 'Create a new post',
        description:
            'All params are a formData. NOT WORKING IN SWAGGER (but yes with postman, fetch, axios...)',
    })
    @ApiResponse({
        description: `Post created.`,
        status: 200,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Post created',
                        data: 'LARGE JSON WITH POST DATA',
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `Token not generated.`,
        status: 400,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'Token not generated',
                        data: 'LARGE JSON WITH ERROR DATA',
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `Post not created.`,
        status: 400,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'Post not created',
                    },
                },
            },
        },
    })
    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiResponse({
        description: `Internal server error.`,
        status: 500,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 500,
                        message: 'Internal server error',
                        data: 'LARGE JSON WITH ERROR DATA',
                    },
                },
            },
        },
    })
    @Post('/new')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'img1', maxCount: 1 },
            { name: 'img2', maxCount: 1 },
        ]),
    )
    createPost(
        @Body('postData') postData: string,
        @Req() req: any,
        @UploadedFiles()
        files: { img1?: Express.Multer.File[]; img2?: Express.Multer.File[] },
    ): Promise<APIresponse> {
        //* I used try/catch statemend because I don't know why, but sometimes the multer interceptor doesn't work
        try {
            const token = req.headers.token;
            return this.postService.createPost(
                token,
                postData,
                files.img1[0].buffer,
                files.img2[0].buffer,
            );
        } catch (error) {
            // Used Promise.resolve({}) because the method must return a Promise<APIresponse>
            throw new HttpException(
                {
                    status: 500,
                    message:
                        'Internal server error, try again, maybe you are in swagger (that route does not work on id) or contact support in github.com/chemokita13',
                    data: error,
                },
                500,
            );
        }
    }
    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiResponse({
        description: `Post created.`,
        status: 201,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Comment created',
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `Token not generated.`,
        status: 400,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'Token not generated',
                        data: 'LARGE JSON WITH ERROR DATA',
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `Internal server error.`,
        status: 500,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 500,
                        message: 'Internal server error',
                        data: 'LARGE JSON WITH ERROR DATA',
                    },
                },
            },
        },
    })
    @ApiParam({
        name: 'postId',
        description: 'Post id, you can get it in /friends/feed',
        type: 'string',
        example: '0btnwqsohhhznB00NEFV2',
    })
    @ApiParam({
        name: 'comment',
        description: 'Comment content',
        type: 'string',
        example: 'Nice post! I like it!',
    })
    @ApiOperation({ summary: 'Comment a post' })
    @Post('/comment')
    commentPost(
        @Req() req: any,
        @Body() body: { postId: string; comment: string },
    ): Promise<APIresponse> {
        const token = req.headers.token;
        const { postId, comment } = body;
        return this.postService.commentPost(token, postId, comment);
    }

    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiParam({
        name: 'postId',
        description: 'Post id, you can get it in /friends/feed',
        type: 'string',
        example: '0btnwqsohhhznB00NEFV2',
    })
    @ApiParam({
        name: 'commentId',
        description: 'Comment id, you can get it in /friends/feed',
        type: 'string',
        example: '0btnwqsohhhznB00NEFV2',
    })
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiResponse({
        description: `Comment deleted.`,
        status: 201,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 201,
                        message: 'Comment deleted',
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `Token not generated.`,
        status: 400,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'Token not generated',
                        data: 'LARGE JSON WITH ERROR DATA',
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `Internal server error.`,
        status: 500,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 500,
                        message: 'Internal server error',
                        data: 'LARGE JSON WITH ERROR DATA',
                    },
                },
            },
        },
    })
    @Delete('comment')
    deletePostComment(
        @Req() req: any,
        @Body() body: { postId: string; commentId: string },
    ): Promise<APIresponse> {
        const token = req.headers.token;
        const { postId, commentId } = body;
        return this.postService.deletePostComment(token, postId, commentId);
    }
}
