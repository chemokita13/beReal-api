import {
    Body,
    Controller,
    Post,
    Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { APIresponse, PostData } from 'src/types/types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
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
        type: 'object',
        required: true,
        schema: {
            type: 'PostData see it scrolling down',
        },
    })
    @ApiOperation({ summary: 'Create a new post' })
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
        const token = req.headers.token;
        return this.postService.createPost(
            token,
            postData,
            files.img1[0].buffer,
            files.img2[0].buffer,
        );
    }
}
