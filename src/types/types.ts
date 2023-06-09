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
