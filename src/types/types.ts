import { ApiProperty } from '@nestjs/swagger';

//* Login types
// Login dto for swagger (used in login.controller.ts: @ApiBody({ type: LoginDto })
export class LoginDto {
    @ApiProperty({
        required: true,
        type: 'string',
        example: '+00123456789',
    })
    phone: string;
}
// Verify dto for swagger (used in login.controller.ts: @ApiBody({ type: VerifyDto })
export class VerifyDto {
    @ApiProperty({
        required: true,
        type: 'string',
        example: '123456',
        description: 'This is the code sent to your phone',
    })
    code: string;
    @ApiProperty({
        required: true,
        type: 'string',
        example: 'exampleexampleexampleexampleexampleexample',
        description:
            'This is the otpSession from the /login/send-code endpoint',
    })
    otpSession: string;
}
// Token refresh route dto for swagger (used in login.controller.ts: @ApiBody({ type: LoginRefreshDto })
export class LoginRefreshDto {
    @ApiProperty({
        required: true,
        type: 'string',
        example: 'exampleexampleexampleexampleexampleexample',
        description:
            'This is the refresh token from the /login/verify endpoint',
    })
    token: string;
}

//* Post module types
// Coment type
export class CommentDto {
    @ApiProperty({
        title: 'Post id',
        type: 'string',
        required: true,
        description:
            'The id of the post you want to comment on. Returned on /friends/feed endpoint',
        example: 'exampleexampleexampleexampleexampleexample',
    })
    postId: string;
    @ApiProperty({
        title: 'Comment',
        description: 'The comment you want to post',
        type: 'string',
        required: true,
        example: 'exampleexampleexampleexampleexampleexample',
    })
    comment: string;
}
export class deleteCommentDto {
    @ApiProperty({
        title: 'Post id',
        type: 'string',
        required: true,
        description:
            'The id of the post you want to delete a comment from. Returned on /friends/feed endpoint',
        example: 'exampleexampleexampleexampleexampleexample',
    })
    postId: string;
    @ApiProperty({
        title: 'Comment id',
        type: 'string',
        required: true,
        description:
            'The id of the comment you want to delete. Returned on /friends/feed endpoint',
        example: 'exampleexampleexampleexampleexampleexample',
    })
    commentId: string;
}

//* Normal API response types
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

export interface FriendsFeed {
    userPosts: UserPosts;
    friendsPosts?: FriendsPostsEntity[] | null;
    remainingPosts: number;
    maxPostsPerMoment: number;
}
export interface UserPosts {
    user: User;
    region: string;
    momentId: string;
    posts?: PostsEntity[] | null;
}
export interface User {
    id: string;
    username: string;
    profilePicture: ProfilePictureOrMediaOrPrimaryOrSecondary;
}
export interface ProfilePictureOrMediaOrPrimaryOrSecondary {
    url: string;
    width: number;
    height: number;
}
export interface PostsEntity {
    id: string;
    visibility?: string[] | null;
    primary: ProfilePictureOrMediaOrPrimaryOrSecondary;
    secondary: ProfilePictureOrMediaOrPrimaryOrSecondary;
    retakeCounter: number;
    lateInSeconds: number;
    isLate: boolean;
    isMain: boolean;
    realMojis?: RealMojisEntity[] | null;
    comments?: null[] | null;
    unblurCount: number;
    takenAt: string;
    creationDate: string;
    updatedAt: string;
}
export interface RealMojisEntity {
    id: string;
    user: User;
    media: ProfilePictureOrMediaOrPrimaryOrSecondary;
    type: string;
    emoji: string;
    isInstant: boolean;
    postedAt: string;
}
export interface FriendsPostsEntity {
    user: User1;
    momentId: string;
    region: string;
    posts?: PostsEntity1[] | null;
}
export interface User1 {
    id: string;
    username: string;
    profilePicture?: ProfilePictureOrMediaOrPrimaryOrSecondary1 | null;
}
export interface ProfilePictureOrMediaOrPrimaryOrSecondary1 {
    url: string;
    width: number;
    height: number;
}
export interface PostsEntity1 {
    id: string;
    primary: ProfilePictureOrMediaOrPrimaryOrSecondary;
    secondary: ProfilePictureOrMediaOrPrimaryOrSecondary;
    location?: Location | null;
    caption?: string | null;
    retakeCounter: number;
    lateInSeconds: number;
    isLate: boolean;
    isMain: boolean;
    takenAt: string;
    realMojis?: (RealMojisEntity1 | null)[] | null;
    comments?: (CommentsEntity | null)[] | null;
    creationDate: string;
    updatedAt: string;
    music?: Music | null;
}
export interface Location {
    latitude: number;
    longitude: number;
}
export interface RealMojisEntity1 {
    id: string;
    user: User;
    media: ProfilePictureOrMediaOrPrimaryOrSecondary;
    type: string;
    emoji: string;
    isInstant: boolean;
    postedAt: string;
}
export interface CommentsEntity {
    id: string;
    user: User1;
    content: string;
    postedAt: string;
}
export interface Music {
    isrc: string;
    track: string;
    artist: string;
    artwork: string;
    provider: string;
    visibility: string;
    providerId: string;
    openUrl: string;
    audioType: string;
}

export default class PostDataRequest {
    @ApiProperty({
        required: true,
    })
    postData: PostData;
    @ApiProperty({
        required: true,
    })
    tokenData: string;
}
