import { Controller, Get, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { APIresponse } from 'src/types/types';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Friends')
@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiOperation({ summary: 'Get your friends feed' })
    @ApiResponse({
        description: `Feed generated.`,
        status: 200,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Feed generated',
                        data: 'LARGE JSON WITH FEED DATA',
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
    @Get('/feed')
    GetFeed(@Req() req: any): Promise<APIresponse> {
        const token = req.headers.token;
        return this.friendsService.getFeed(token);
    }

    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiOperation({
        summary: 'Get your friends-of-friends feed',
        description:
            'Only works if the user have posted, if not, the route will return empty json',
    })
    @ApiResponse({
        description: `Feed generated.`,
        status: 200,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Feed generated',
                        data: 'LARGE JSON WITH FEED DATA',
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
    @Get('/friends-of-friends')
    GetFriendsOfFriends(@Req() req: any): Promise<APIresponse> {
        const token = req.headers.token;
        return this.friendsService.getFriendsOfFriends(token);
    }

    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiOperation({ summary: 'Get your friends info list' })
    @ApiResponse({
        description: `Friends generated.`,
        status: 200,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Friends generated',
                        data: 'LARGE JSON WITH FRIENDS DATA',
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
    @Get('/info')
    GetInfo(@Req() req: any): Promise<APIresponse> {
        const token = req.headers.token;
        return this.friendsService.getFriends(token);
    }

    @ApiOperation({ summary: 'Get your users info' })
    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiResponse({
        description: `User info generated.`,
        status: 200,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'User info generated',
                        data: 'LARGE JSON WITH USER INFO DATA',
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
    @Get('/me')
    GetUserInfo(@Req() req: any): Promise<APIresponse> {
        const token = req.headers.token;
        return this.friendsService.getUserInfo(token);
    }

    @ApiOperation({ summary: 'Get your memories feed' })
    @ApiHeader({
        name: 'token',
        description: 'JWT Token returned in /login/verify route',
        required: true,
    })
    @ApiResponse({
        description: `Memories feed generated.`,
        status: 200,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Memories feed generated',
                        data: 'LARGE JSON WITH MEMORIES FEED DATA',
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
    @Get('/mem-feed')
    GetMemFeed(@Req() req: any): Promise<APIresponse> {
        const token = req.headers.token;
        return this.friendsService.getMemFeed(token);
    }
}
