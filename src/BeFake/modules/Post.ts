import * as moment from 'moment';
import BeFake from '../BeFake';
import { PostUpload, PostUploadBySteps } from './PostUpload';
import axios from 'axios';
import { BeFakeResponse } from '../types/BeFakeResponse';
export class Post {
    // BeFake object instance
    private beFake: BeFake;

    // Constructor (BeFake object instance)
    constructor(beFake: BeFake) {
        this.beFake = beFake;
    }

    public async getData(): Promise<BeFakeResponse> {
        const siteToUpload: PostUploadBySteps = new PostUploadBySteps();
        const response: BeFakeResponse = await siteToUpload.getData(
            this.beFake,
        );
        if (response.done) {
            return {
                done: true,
                msg: response.msg,
                data: response.data,
            };
        }
        return {
            done: false,
            msg: response.msg,
        };
    }

    public async makeRequest(
        url: string,
        head: any,
        photo: Uint8Array,
    ): Promise<BeFakeResponse> {
        try {
            const postToUpload: PostUploadBySteps = new PostUploadBySteps();
            const response: BeFakeResponse = await postToUpload.MakeRequest(
                url,
                head,
                photo,
            );
            console.log('🚀 ~ file: Post.ts:45 ~ Post ~ response:', response);
            return {
                done: true,
                msg: response.msg,
                data: response.data,
            };
        } catch (error) {
            return {
                done: false,
                msg: error,
            };
        }
    }

    public async postPhoto(
        late: boolean = true,
        visibility: string = 'friends',
        retakes: number = 0,
        primary_size: [number, number],
        secondary_size: [number, number],
        primaryPath: string,
        secondaryPath: string,
        taken_at: string = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        caption?: string, // caption is optional
        location?: [number, number],
    ): Promise<BeFakeResponse> {
        console.log('🚀 ~ file: Post.ts:71 ~ Post ~ caption:', caption);
        console.log(
            '🚀 ~ file: Post.ts:71 ~ Post ~ secondaryPath:',
            secondaryPath,
        );
        console.log('🚀 ~ file: Post.ts:71 ~ Post ~ primaryPath:', primaryPath);
        let json_data: any = {
            isLate: late,
            retakeCounter: retakes,
            takenAt: taken_at,
            caption: caption,
            visibility: [visibility],
            backCamera: {
                bucket: 'storage.bere.al',
                height: primary_size[1],
                width: primary_size[0],
                path: primaryPath,
            },
            frontCamera: {
                bucket: 'storage.bere.al',
                height: secondary_size[1],
                width: secondary_size[0],
                path: secondaryPath,
            },
        };
        console.log('🚀 ~ file: Post.ts:96 ~ Post ~ json_data:', json_data);
        if (location) {
            json_data['location'] = {
                latitude: location[0],
                longitude: location[1],
            };
        }

        try {
            console.log(
                '🚀 ~ file: Post.ts:112 ~ Post ~ this.beFake.token:',
                this.beFake.token,
            );
            const response = await axios.post(
                'https://mobile.bereal.com/api/content/posts',
                json_data,
                {
                    headers: {
                        Authorization: `Bearer ${this.beFake.token}`,
                        'user-agent':
                            'BeReal/1.0.1 (AlexisBarreyat.BeReal; build:9513; iOS 16.0.2) 1.0.0/BRApriKit',
                        'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                    },
                },
            );
            console.log('🚀 ~ file: Post.ts:113 ~ Post ~ response:', response);
            return {
                done: true,
                msg: response.data,
            };
        } catch (error) {
            console.log('🚀 ~ file: Post.ts:119 ~ Post ~ error:', error);

            return {
                done: false,
                msg: error,
            };
        }
    }

    // create post function
    public async createPost(
        primary: Uint8Array,
        secondary: Uint8Array,
        late: boolean,
        visibility: string = 'friends',
        resize: boolean = true,
        retakes: number = 0,
        caption?: string, // caption is optional
        taken_at?: string,
        location?: [number, number],
    ): Promise<BeFakeResponse> {
        if (!taken_at) {
            taken_at = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else {
            taken_at = moment(taken_at).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }
        const postUpload = new PostUpload(
            primary,
            secondary,
            late,
            resize,
            visibility,
            retakes,
            caption,
        );
        const posted = await postUpload.upload(this.beFake);
        if (!posted.done) {
            return {
                done: false,
                msg: 'Error while uploading photos postUpload.upload()',
            };
        }
        let json_data: any = {
            isLate: late,
            retakeCounter: retakes,
            takenAt: taken_at,
            caption: caption,
            visibility: [visibility],
            backCamera: {
                bucket: 'storage.bere.al',
                height: postUpload.primary_size[1],
                width: postUpload.primary_size[0],
                path: postUpload.primaryPath,
            },
            frontCamera: {
                bucket: 'storage.bere.al',
                height: postUpload.secondary_size[1],
                width: postUpload.secondary_size[0],
                path: postUpload.secondaryPath,
            },
        };
        if (location) {
            json_data['location'] = {
                latitude: location[0],
                longitude: location[1],
            };
        }

        try {
            const response = await axios.post(
                'https://mobile.bereal.com/api/content/posts',
                json_data,
                {
                    headers: {
                        Authorization: `Bearer ${this.beFake.token}`,
                    },
                },
            );
            return {
                done: true,
                msg: response.data,
            };
        } catch (error) {
            return {
                done: false,
                msg: error,
            };
        }
    }
}
