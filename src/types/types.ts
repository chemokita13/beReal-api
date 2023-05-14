import { ApiProperty } from '@nestjs/swagger';

export type APIresponse = {
    status: number;
    message: string;
    data?: any;
};

export type tokenObj = {
    access: AccessOrFirebase;
    firebase: AccessOrFirebase;
    userId: string;
};
export type AccessOrFirebase = {
    refresh_token: string;
    token: string;
    expires: string;
};

export class PostData {
    @ApiProperty({
        required: false,
        default: false,
    })
    resize?: boolean;
    @ApiProperty({
        required: false,
        default: true,
    })
    late?: boolean;
    @ApiProperty({
        required: true,
        type: 'friends || friends-of-friends || public',
    })
    visibility: string;
    @ApiProperty({
        required: false,
        default: 0,
    })
    retakes?: number;
    @ApiProperty({
        required: false,
    })
    caption?: string;
    @ApiProperty({
        required: false,
        type: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    })
    taken_at?: string;
    @ApiProperty({
        required: false,
        type: '[number(lat), number(lon)]',
    })
    location?: [number, number];
}
