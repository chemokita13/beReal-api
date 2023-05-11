import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common/enums';

@ApiTags('Server')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({ summary: 'Ping the server' })
    @ApiResponse({
        description: `API is down or not responding.`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        content: {
            'application/json': {
                schema: {
                    example: {
                        statusCode: 500,
                        message: 'Internal Server Error',
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `API is up and responding.`,
        status: HttpStatus.OK,
        content: {
            'application/json': {
                schema: {
                    example: {
                        statusCode: 200,
                        message: 'Pong!',
                    },
                },
            },
        },
    })
    @Get('/ping')
    Ping(): { statusCode: number; message: string } {
        return this.appService.ping();
    }
}
