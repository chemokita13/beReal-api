import * as sharp from 'sharp';
import BeFake from '../BeFake';
import axios from 'axios';
import { BeFakeResponse } from '../types/BeFakeResponse';

export class PostUpload {
    // Base64 encoded images
    private primary: Uint8Array;
    private secondary: Uint8Array;
    // If resize is true, the image will be resized
    private resize: boolean;
    // if is late or not
    public late: boolean;
    // visibility
    public visibility: string;
    // post caption
    public caption?: string;
    // retakes
    public retakes: number;
    // primary and secondary size
    public primary_size: [number, number];
    public secondary_size: [number, number];
    // primary and secondary path
    public primaryPath?: string;
    public secondaryPath?: string;

    // Constructor
    constructor(
        primary: Uint8Array,
        secondary: Uint8Array,
        late: boolean,
        resize: boolean = false,
        visibility: string = 'friends',
        retakes: number = 0,
        caption?: string, // caption is optional
    ) {
        this.primary = primary;
        this.secondary = secondary;
        this.resize = resize;
        this.late = late;
        this.visibility = visibility;
        this.caption = caption;
        this.retakes = retakes;
        this.primary_size = [1500, 2000];
        this.secondary_size = [1500, 2000];
        this.changePhotos(); // Because cant use await in constructor
    }

    // Change photos to webp and resize if resize is true (constructors prolongation)
    private async changePhotos(): Promise<void> {
        // Render imgs
        this.primary = await sharp(this.primary).toBuffer();
        this.secondary = await sharp(this.secondary).toBuffer();
        // Getting MIME types
        const primaryMime = (await sharp(this.primary).metadata()).format;
        const secondaryMime = (await sharp(this.secondary).metadata()).format;
        // if mime != webp => convert srgb
        if (primaryMime != 'webp') {
            this.primary = await sharp(this.primary)
                .toFormat('webp')
                .toBuffer();
        }
        if (secondaryMime != 'webp') {
            this.secondary = await sharp(this.secondary)
                .toFormat('webp')
                .toBuffer();
        }
        // Resize imgs if resize is true
        if (this.resize) {
            const newsize = [1500, 2000];
            this.primary = await sharp(this.primary)
                .resize(newsize[0], newsize[1])
                .toBuffer();
            this.secondary = await sharp(this.secondary)
                .resize(newsize[0], newsize[1])
                .toBuffer();
        }
    }

    // Upload photos to server (first steps: get path, urls and headers)
    public async upload(beFake: BeFake): Promise<BeFakeResponse> {
        try {
            const response = await beFake._apiRequest(
                'get',
                'content/posts/upload-url',
                {},
                { mimeType: 'image/webp' },
            );

            let headers1 = response.data[0].headers;
            headers1['Authorization'] = 'Bearer ' + beFake.token;
            headers1['user-agent'] = beFake.headers['user-agent'];
            const url1 = response.data[0].url;
            let headers2 = response.data[1].headers;
            headers2['Authorization'] = 'Bearer ' + beFake.token;
            headers2['user-agent'] = beFake.headers['user-agent'];
            const url2 = response.data[1].url;

            const primary_res = await axios.put(url1, this.primary, {
                headers: headers1,
            });
            const secondary_res = await axios.put(url2, this.secondary, {
                headers: headers2,
            });
            //?console.log(primary_res, secondary_res);
            this.primaryPath = response.data[0].path;
            this.secondaryPath = response.data[1].path;
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

export class PostUploadBySteps {
    // Base64 encoded images
    private primary?: Uint8Array;
    private secondary?: Uint8Array;
    // If resize is true, the image will be resized
    private resize: boolean;
    // if is late or not
    public late: boolean;
    // visibility
    public visibility: string;
    // post caption
    public caption?: string;
    // retakes
    public retakes: number;
    // primary and secondary size
    public primary_size: [number, number];
    public secondary_size: [number, number];
    // primary and secondary path
    public primaryPath?: string;
    public secondaryPath?: string;

    // Constructor
    constructor() {
        // caption?: string, // caption is optional // retakes: number = 0, // visibility: string = 'friends', // resize: boolean = false, // late: boolean, //secondary: Uint8Array, //primary: Uint8Array,
        //this.primary = primary;
        //this.secondary = secondary;
        // this.resize = resize;
        // this.late = late;
        // this.visibility = visibility;
        // this.caption = caption;
        // this.retakes = retakes;
        this.primary_size = [1500, 2000];
        this.secondary_size = [1500, 2000];
        //this.changePhotos(); // Because cant use await in constructor
    }

    // Change photos to webp and resize if resize is true (constructors prolongation)
    private async changePhotos(photo: Uint8Array): Promise<Uint8Array> {
        try {
            let newPhoto: Uint8Array;
            // Render imgs
            newPhoto = await sharp(photo).toBuffer();
            // Getting MIME types
            const primaryMime = (await sharp(newPhoto).metadata()).format;
            // if mime != webp => convert srgb
            if (primaryMime != 'webp') {
                newPhoto = await sharp(photo).toFormat('webp').toBuffer();
            }
            // Resize imgs if resize is true
            if (this.resize) {
                const newsize = [1500, 2000];
                newPhoto = await sharp(newPhoto)
                    .resize(newsize[0], newsize[1])
                    .toBuffer();
            }
            return newPhoto;
        } catch (error) {
            console.log(error);
        }
    }

    public async getData(beFake: BeFake): Promise<BeFakeResponse> {
        try {
            const response = await beFake._apiRequest(
                'get',
                'content/posts/upload-url',
                {},
                { mimeType: 'image/webp' },
            );
            let headers1 = response.data[0].headers;
            headers1['Authorization'] = 'Bearer ' + beFake.token;
            headers1['user-agent'] = beFake.headers['user-agent'];
            const url1 = response.data[0].url;
            let headers2 = response.data[1].headers;
            headers2['Authorization'] = 'Bearer ' + beFake.token;
            headers2['user-agent'] = beFake.headers['user-agent'];
            const url2 = response.data[1].url;
            return {
                done: true,
                msg: 'all ok',
                data: {
                    firstRequest: {
                        url: url1,
                        headers: headers1,
                    },
                    secondRequest: {
                        url: url2,
                        headers: headers2,
                    },
                    paths: {
                        primaryPath: response.data[0].path,
                        secondaryPath: response.data[1].path,
                    },
                },
            };
        } catch (error) {
            return {
                done: false,
                msg: error,
            };
        }
    }
    public async MakeRequest(
        url: string,
        headers: any,
        data: Uint8Array,
    ): Promise<BeFakeResponse> {
        const photo: Uint8Array = await this.changePhotos(data);
        try {
            const response = await axios.put(url, photo, {
                headers: headers,
            });
            console.log(
                '🚀 ~ file: PostUpload.ts:230 ~ PostUploadBySteps ~ MakeRequest ~ response:',
                response,
            );
            return {
                done: true,
                msg: response.statusText,
                data: response.data,
            };
        } catch (error) {
            return {
                done: false,
                msg: error,
            };
        }
    }
}
