import { Controller, Get, Param, Req } from '@nestjs/common';
import { RealmojisService } from './realmojis.service';
import {
    ApiHeader,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { APIresponse } from 'src/types/types';

@ApiTags('Realmojis')
@Controller('realmojis')
export class RealmojisController {
    constructor(private readonly realmojisService: RealmojisService) {}
    @ApiHeader({
        name: 'token',
        description: 'The token to authenticate',
    })
    @ApiParam({
        name: 'postId',
        description: 'The id of the post',
    })
    @ApiParam({
        name: 'userId',
        description: 'The id of the user',
    })
    @ApiResponse({
        status: 200,
        description: 'The realmojis of the post',
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Realmojis fetched successfully',
                        data: { 'Large json array with data': '...' },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'URL Params error',
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'PostId or UserId not provided',
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Token error',
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'Token not generated',
                    },
                },
            },
        },
    })
    @ApiOperation({
        summary: 'Get realmojis of a post',
        description: 'Get realmojis of a post given a userId and a postID',
    })
    @Get('/:userId/:postId')
    getReactions(@Req() req: any, @Param() params: any): Promise<APIresponse> {
        const token = req.headers.token;
        const postId = params.postId;
        const userId = params.userId;
        return this.realmojisService.getReactions(token, postId, userId);
    }
}
