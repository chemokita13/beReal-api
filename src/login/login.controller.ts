import { Controller } from '@nestjs/common';
import { LoginService } from './login.service';
import { Post, Body } from '@nestjs/common';
import {
    APIresponse,
    LoginDto,
    LoginRefreshDto,
    VerifyDto,
} from 'src/types/types';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Login')
@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @ApiBody({
        description: 'Credentials to authenticate a user',
        type: LoginDto,
    })
    @ApiOperation({ summary: 'Send otp code to your phone' })
    @ApiResponse({
        description: `OTP sent.`,
        status: 201,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'OTP sent',
                        data: {
                            otpSesion: {
                                otpSesion:
                                    'exampleexampleexampleexampleexampleexample',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `OTP not sent.`,
        status: 400,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'OTP not sent',
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
                        data: 'Any error',
                    },
                },
            },
        },
    })
    @Post('/send-code')
    SendCode(@Body() body: { phone: string }): Promise<APIresponse> {
        return this.loginService.sendCode(body);
    }

    @ApiBody({
        description: 'Credentials to authenticate a user',
        type: VerifyDto,
    })
    @ApiOperation({ summary: 'Verify otp code' })
    @ApiResponse({
        description: `OTP verified.`,
        status: 201,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'OTP verified',
                        data: {
                            tokenObj: 'JWT_TOKEN',
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `OTP not verified.`,
        status: 400,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'OTP not verified',
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
                        data: 'Any error',
                    },
                },
            },
        },
    })
    @Post('/verify')
    VerifyCode(
        @Body() body: { code: string; otpSession: string },
    ): Promise<APIresponse> {
        return this.loginService.verifyCode(body);
    }

    @ApiBody({
        description: 'Credentials to authenticate a user',
        type: LoginRefreshDto,
    })
    @ApiOperation({ summary: 'Refresh token' })
    @ApiResponse({
        description: `Token refreshed.`,
        status: 201,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 200,
                        message: 'Token refreshed',
                        data: {
                            token: 'JWT_TOKEN',
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        description: `Token not refreshed.`,
        status: 400,
        content: {
            'application/json': {
                schema: {
                    example: {
                        status: 400,
                        message: 'Token not refreshed',
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
                        data: 'Any error',
                    },
                },
            },
        },
    })
    @Post('/refresh')
    RefreshToken(@Body() body: { token: string }): Promise<any> {
        return this.loginService.refreshToken(body.token);
    }
}
