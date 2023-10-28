import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Post,
    Put,
    Req,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import PostDataRequest, {
    APIresponse,
    CommentDto,
    ImageUploadDto,
    PostData,
    deleteCommentDto,
} from 'src/types/types';
import {
    FileFieldsInterceptor,
    FileInterceptor,
} from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiExtraModels,
    ApiHeader,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

//* WARNING: Fold all to better view (In vscode: cntrl + k + 0)
@ApiTags('Post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}
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
        name: 'visibility',
        description: 'Post visibility',
        type: 'string<friends | friends-of-friends | public>',
        required: true,
        schema: {
            description: 'Post visibility',
        },
    })
    @ApiParam({
        name: 'resize',
        description: 'Resize images',
        type: 'string<boolean>',
        required: false,
        schema: {
            description: 'Resize images',
        },
    })
    @ApiParam({
        name: 'late',
        description: 'Late post',
        type: 'string<boolean>',
        required: false,
        schema: {
            description: 'Late post',
        },
    })
    @ApiParam({
        name: 'retakes',
        description: 'Retakes',
        type: 'string<number>',
        required: false,
        schema: {
            description: 'Retakes',
        },
    })
    @ApiParam({
        name: 'caption',
        description: 'Caption',
        type: 'string',
        required: false,
        schema: {
            description: 'Caption',
        },
    })
    @ApiParam({
        name: 'taken_at',
        description: 'Taken at',
        type: 'string<YYYY-MM-DDTHH:mm:ss.SSS[Z]>',
        required: false,
        schema: {
            description: 'Taken at',
        },
    })
    @ApiParam({
        name: 'location',
        description: 'Location',
        type: 'string<[lat<float>,long<float>]>',
        required: false,
        schema: {
            description: 'Location',
        },
    })
    @ApiOperation({
        summary: 'Create a new post (DEPRECATED, SEE 3 last routes)',
        description:
            'All params except a token are a formData. NOT WORKING IN SWAGGER (but yes with postman, fetch, axios...)',
        deprecated: true,
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
        @Req() req: any,
        @UploadedFiles()
        files: { img1?: Express.Multer.File[]; img2?: Express.Multer.File[] },
        @Body('visibility')
        visibility: 'friends' | 'friends-of-friends' | 'public',
        @Body('resize') resize?: string,
        @Body('late') late?: string,
        @Body('retakes') retakes?: string,
        @Body('caption') caption?: string,
        @Body('taken_at') taken_at?: string,
        @Body('location') location?: string,
    ): Promise<APIresponse> {
        //* I used try/catch statemend because I don't know why, but sometimes the multer interceptor doesn't work
        try {
            const token = req.headers.token;
            return this.postService.createPost(
                token,
                {
                    visibility,
                    resize: resize == 'true' ? true : false,
                    late: late == 'true' ? true : false,
                    retakes: retakes ? parseInt(retakes) : 0,
                    caption,
                    taken_at,
                    location: location
                        ? [
                              parseFloat(location.split(',')[0]),
                              parseFloat(location.split(',')[1]),
                          ]
                        : undefined,
                },
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
                        status: 201,
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
    @ApiBody({
        type: CommentDto,
        description: 'Comment data and post id',
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
    @ApiBody({
        type: deleteCommentDto,
        description: 'Comment data and post id',
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

    //* Postupload by steps
    // TODO: add response ok
    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiResponse({
        description: 'Tokens returned',
        status: 201,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 201,
                        message: 'Photo created',
                        data: {
                            firstPhotoToken: 'tokentokentokentoken',
                            secondPhotoToken: 'tokentokentokentoken',
                            postDataToken: 'tokentokentokentoken',
                        },
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
    @ApiOperation({
        summary: 'Get data to upload a post. Step 1 to upload a post',
        description:
            'This route returns 3 tokens, you must send it in /post/upload/data and /post/upload/photo route',
    })
    @Get('/upload/getData')
    getPostUploadData(@Req() req: any): Promise<APIresponse> {
        const token = req.headers.token;
        return this.postService.getData(token);
    }
    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
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
    @ApiOperation({
        summary: 'Upload a photo. Step 2 to upload a post',
        description:
            'You must send the tokenData returned in /post/upload/getData route (firstPhotoToken or secondPhotoToken).',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image and token to upload',
        type: ImageUploadDto,
    })
    @UseInterceptors(FileInterceptor('img'))
    @Put('/upload/photo')
    uploadPhoto(
        @Req() req: any,
        @UploadedFile() img: Express.Multer.File,
        @Body('tokenData') tokenData: string,
    ): Promise<APIresponse> {
        const token = req.headers.token;
        return this.postService.makeRequest(token, tokenData, img.buffer);
    }
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
    @ApiOperation({
        summary: 'Upload a post',
        description: 'You must send the postData params for your post',
    })
    @ApiBody({
        type: PostDataRequest,
        description: 'Post data and token',
    })
    @Post('/upload/data')
    postUpload(
        @Req() req: any,
        @Body() body: { postData: PostData; tokenData: string },
    ) {
        const token = req.headers.token;
        return this.postService.postPhoto(token, body.postData, body.tokenData);
    }
}
