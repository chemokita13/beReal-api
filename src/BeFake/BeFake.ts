import axios from 'axios';

import * as sharp from 'sharp'; // to download and resize images
import * as moment from 'moment';
import { Post } from './modules/Post';
import { BeFakeResponse } from './types/BeFakeResponse';
import { tokenObj } from 'src/types/types';

export default class BeFake {
    //* Types
    google_api_key: string;
    api_url: string;
    disable_ssl: boolean;
    tokenInfo: any;
    expiration: any; // moment
    firebaseExpiration: any; // moment
    userId: any;
    token: any;
    //proxies: null;
    deviceId: string;
    refresh_token: any;
    otpSession: any; // OTP code session
    firebase_refresh_token: any; // Firebase refresh token
    headers: any; // axios headers
    firebaseToken: any; // Firebase token
    dataPath: string; // Path to the data folder

    constructor(
        tokenObj: tokenObj = null,
        refresh_token = null,
        proxies = null,
        disable_ssl = false,
        deviceId = null,
        ///api_url?,
        ///google_api_key?
    ) {
        tokenObj && this.loadToken(tokenObj); // load token if provided
        (this.disable_ssl = false),
            (this.deviceId = deviceId || this._generateRandomDeviceId()),
            (this.api_url = 'https://mobile.bereal.com/api'),
            (this.google_api_key = 'AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA'),
            (this.headers = {
                'user-agent':
                    'BeReal/1.0.1 (AlexisBarreyat.BeReal; build:9513; iOS 16.0.2) 1.0.0/BRApriKit',
                'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
            });
        this.dataPath = 'programData';
    }

    // Generate a random device id, (random string with 16chars)
    _generateRandomDeviceId(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length),
            );
        }
        return result;
    }

    async sendOtpCloud(phoneNumber: string): Promise<BeFakeResponse> {
        try {
            const firstData = JSON.stringify({
                appToken:
                    '54F80A258C35A916B38A3AD83CA5DDD48A44BFE2461F90831E0F97EBA4BB2EC7',
            });
            const firstUrl =
                'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=' +
                this.google_api_key;
            const firstReq = await fetch(firstUrl, {
                method: 'POST',
                body: firstData,
                headers: {
                    'content-type': 'application/json',
                    accept: '*/*',
                    'x-client-version':
                        'iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS',
                    'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                    'accept-language': 'en',
                    'user-agent':
                        'FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1',
                    'x-firebase-locale': 'en',
                    'x-firebase-gmpid': '1:405768487586:ios:28c4df089ca92b89',
                },
            });
            if (!firstReq.ok) {
                return {
                    done: false,
                    msg: 'Something went wrong',
                };
            }
            const firstResponse = await firstReq.json();
            const receipt = firstResponse.receipt;
            const secondData = JSON.stringify({
                phoneNumber: phoneNumber,
                iosReceipt: receipt,
            });
            const secondUrl =
                'https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=' +
                this.google_api_key;
            const secondReq = await fetch(secondUrl, {
                method: 'POST',
                body: secondData,
                headers: {
                    'content-type': 'application/json',
                    accept: '*/*',
                    'x-client-version':
                        'iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS',
                    'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                    'accept-language': 'en',
                    'user-agent':
                        'FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1',
                    'x-firebase-locale': 'en',
                    'x-firebase-gmpid': '1:405768487586:ios:28c4df089ca92b89',
                },
            });
            if (!secondReq.ok) {
                return {
                    done: false,
                    msg: 'Something went wrong',
                };
            }
            const secondResponse = await secondReq.json();
            this.otpSession = secondResponse.sessionInfo;
            return {
                done: true,
                msg: 'OTP code sent',
                data: { otpSession: secondResponse.sessionInfo },
            };
        } catch (error) {
            return {
                done: false,
                msg: 'Something went wrong',
                data: error,
            };
        }
    }

    async verifyOtpCloud(otpCode: string, otpSession: string) {
        try {
            const data = {
                code: otpCode,
                sessionInfo: otpSession,
                operation: 'SIGN_UP_OR_IN',
            };
            const loginUrl: string =
                'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA';
            //const response = await axios.post(loginUrl, data);
            const req = await fetch(loginUrl, {
                method: 'POST',
                body: JSON.stringify(data),
            });
            if (!req.ok) {
                return {
                    done: false,
                    msg: 'Something went wrong',
                    data: await req.json(),
                };
            }
            const response = await req.json();
            this.firebase_refresh_token = response.refreshToken;
            // refresh the token
            await this.firebaseRefreshTokens();
            const log = await this.grantAccessToken();
            // save user info (tokens, userId...)
            return {
                done: true,
                msg: 'OTP verified successfully, call saveToken() to get the tokens',
                data: log,
            };
        } catch (error) {
            console.log(
                '🚀 ~ file: BeFake.ts:117 ~ BeFake ~ verifyOtpCloud ~ error:',
                error,
            );
            return {
                done: false,
                msg: 'Something went wrong',
                data: error,
            };
        }
    }

    // Send a mobile verification (vonage) code to a phone number via SMS
    async sendOtpVonage(phoneNumber: string): Promise<BeFakeResponse> {
        const data = {
            phoneNumber: phoneNumber,
            deviceId: this._generateRandomDeviceId(),
        };
        const response = await axios.post(
            'https://auth.bereal.team/api/vonage/request-code',
            data,
            {
                headers: {
                    'user-agent':
                        'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
                },
            },
        );

        if (response.status == 200) {
            this.otpSession = response.data.vonageRequestId;
            return {
                done: true,
                msg: 'OTP sent successfully',
                data: { otpSesion: this.otpSession },
            };
        } else {
            return {
                done: false,
                msg: 'Something went wrong',
                data: response,
            };
        }
    }

    saveToken() {
        // create an object with the tokens and the userId
        const objToSave = {
            access: {
                refresh_token: this.refresh_token,
                token: this.token,
                expires: this.expiration.format(),
            },
            firebase: {
                refresh_token: this.firebase_refresh_token,
                token: this.firebaseToken,
                expires: this.firebaseExpiration.format(),
            },
            userId: this.userId,
        };

        return objToSave;
    }

    async refreshTokens(): Promise<BeFakeResponse> {
        try {
            const response = await axios.post(
                'https://auth.bereal.team/token',
                {
                    grant_type: 'refresh_token',
                    client_id: 'ios',
                    client_secret: '962D357B-B134-4AB6-8F53-BEA2B7255420',
                    refresh_token: this.refresh_token,
                },
                {
                    params: { grant_type: 'refresh_token' },
                },
            );
            this.token = response.data.access_token;
            this.expiration = moment().add(response.data.expires_in, 'seconds');
            this.refresh_token = response.data.refresh_token;
            const dataToReturn: tokenObj = {
                access: {
                    refresh_token: this.refresh_token,
                    token: this.token,
                    expires: this.expiration.format(),
                },
                firebase: {
                    refresh_token: this.firebase_refresh_token,
                    token: this.firebaseToken,
                    expires: this.firebaseExpiration.format(),
                },
                userId: this.userId,
            };
            return {
                done: true,
                msg: 'Token refreshed successfully',
                data: {
                    response: response.data,
                    mainData: dataToReturn,
                },
            };
        } catch (error) {
            return {
                done: false,
                msg: 'Something went wrong',
                data: error,
            };
        }
    }

    // load the tokens from a JSON file
    async loadToken(data: tokenObj): Promise<BeFakeResponse> {
        try {
            const obj = data;

            // set the tokens
            this.refresh_token = obj.access.refresh_token;
            this.token = obj.access.token;
            this.expiration = moment(obj.access.expires);
            this.firebase_refresh_token = obj.firebase.refresh_token;
            this.firebaseToken = obj.firebase.token;
            this.firebaseExpiration = moment(obj.firebase.expires);
            this.userId = obj.userId;
            //console.log('Loaded token successfully');
            //* await this.refreshTokens();
            //* await this.firebaseRefreshTokens();
            return {
                done: true,
                msg: 'Tokens loaded successfully',
            };
        } catch (error) {
            return {
                done: false,
                msg: 'Something went wrong',
                data: error,
            };
        }
    }

    // Verify a mobile verification (vonage) code sent to a phone number via SMS
    async verifyOtpVonage(
        otpCode: string,
        otpSesion: string,
    ): Promise<BeFakeResponse> {
        const otpVerRes = await axios.post(
            'https://auth.bereal.team/api/vonage/check-code',
            {
                vonageRequestId: otpSesion,
                code: otpCode,
            },
        );

        // TODO: check if the response is 200 or 201
        if (otpVerRes.data.status != 0) {
            return {
                done: false,
                msg: 'OTP verification failed',
                data: otpVerRes.data,
            };
        }
        try {
            const tokenRes = await axios.post(
                'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken',
                {
                    token: otpVerRes.data.token,
                    returnSecureToken: true,
                },
                {
                    params: {
                        key: this.google_api_key,
                    },
                },
            );

            // set the token
            this.firebase_refresh_token = tokenRes.data.refreshToken;

            // refresh the token
            await this.firebaseRefreshTokens();
            // grant the access token
            const k = await this.grantAccessToken();
            // save user info (tokens, userId...)
            ///await this.saveToken();
            return {
                done: true,
                msg: 'OTP verified successfully, call saveToken() to get the tokens',
                data: k,
            };
        } catch (error) {
            return {
                done: false,
                msg: 'Something went wrong',
                data: error,
            };
        }
    }

    // upload the token for avoid expiration
    async firebaseRefreshTokens(): Promise<any> {
        // If there is no firebase_refresh_token, exit
        if (!this.firebase_refresh_token) {
            return 'No firebase_refresh_token, please login first';
        }

        try {
            const response = await axios.post(
                'https://securetoken.googleapis.com/v1/token',
                {
                    grantType: 'refresh_token',
                    refreshToken: this.firebase_refresh_token,
                },
                {
                    headers: this.headers,
                    withCredentials: true,
                    params: { key: this.google_api_key },
                },
            );

            // Exception handling
            if (response.status !== 200) {
                // console.log(
                //     'Token refresh failed(l164), error: ',
                //     response.data,
                // );
                return;
            }

            this.firebase_refresh_token = response.data.refresh_token;
            this.firebaseToken = response.data.id_token;
            this.firebaseExpiration = moment().add(
                parseInt(response.data.expires_in),
                'seconds',
            );
            this.userId = response.data.user_id;
        } catch (error) {
            return {
                done: false,
                msg: 'Something went wrong',
                data: error,
            };
        }
    }

    // grant the access token
    async grantAccessToken(): Promise<void> {
        // If there is no firebaseToken, exit
        if (!this.firebaseToken) {
            return;
        }

        const response = await axios.post(
            'https://auth.bereal.team/token',
            {
                grant_type: 'firebase',
                client_id: 'ios',
                client_secret: '962D357B-B134-4AB6-8F53-BEA2B7255420',
                token: this.firebaseToken,
            },
            {
                headers: this.headers,
                withCredentials: true,
                params: { grant_type: 'firebase' },
            },
        );

        // Exception handling
        if (response.status !== 201) {
            return;
        }
        this.refresh_token = response.data.refresh_token;
        this.expiration = moment().add(
            parseInt(response.data.expires_in),
            'seconds',
        );

        this.token = await response.data.access_token;
        return;
    }

    // make all BeReal's API requests
    async _apiRequest(
        method: string,
        endpoint: string,
        data?: object,
        params?: object,
    ): Promise<any> {
        const response = await axios({
            method: method,
            url: this.api_url + '/' + endpoint,
            headers: {
                Authorization: 'Bearer ' + this.token,
            },
            data: data,
            params: params,
        });
        return response.data;
    }

    // Get friends feed
    async getFriendsFeed(): Promise<BeFakeResponse> {
        const response = await this._apiRequest('GET', 'feeds/friends-v1');
        try {
            return {
                done: true,
                msg: 'Data returned successfully',
                data: response,
            };
        } catch (error) {
            return {
                done: false,
                msg: 'Error saving data',
                data: error,
            };
        }
    }

    // Get friends-of-friends feed
    async getFriendsOfFriendsFeed(): Promise<BeFakeResponse> {
        const response = await this._apiRequest(
            'GET',
            'feeds/friends-of-friends',
        );
        try {
            return {
                done: true,
                msg: 'Data returned successfully',
                data: response,
            };
        } catch (error) {
            return {
                done: false,
                msg: 'Error saving data',
                data: error,
            };
        }
    }

    // Get friends info
    async getFriends(): Promise<BeFakeResponse> {
        const response = await this._apiRequest('GET', 'relationships/friends');

        return {
            done: true,
            msg: 'Data returned successfully',
            data: response,
        };
    }

    // Comment a post
    async commentPost(
        postId: string,
        comment: string,
    ): Promise<BeFakeResponse> {
        // Prepare the data to send in the request
        const payload = {
            postId: postId,
        };
        const data = {
            content: comment,
        };
        const response = await this._apiRequest(
            'POST',
            'content/comments',
            data,
            payload,
        );
        return {
            done: true,
            msg: 'Comment posted successfully',
            data: response,
        };
    }

    // Get friend suggestions
    async getFriendSuggestions(page?: number): Promise<BeFakeResponse> {
        const response = await this._apiRequest(
            'GET',
            'relationships/suggestions',
            {}, // data empty
            page ? { page: page } : {}, // if page is defined, send it
        );
        return {
            done: true,
            msg: 'Friend suggestions returned successfully',
            data: response,
        };
    }

    // Post a photo
    async postUpload(
        primary: Uint8Array,
        secondary: Uint8Array,
        resize: boolean = true,
        late: boolean = true,
        visibility: string = 'friends',
        retakes: number = 0,
        caption: string = '',
        takenAt?: string,
        location?: [number, number],
    ): Promise<BeFakeResponse> {
        try {
            const primaryImg = await sharp(primary).toBuffer();
            const secondaryImg = await sharp(secondary).toBuffer();

            const post = new Post(this);

            const postUploaded = await post.createPost(
                primaryImg,
                secondaryImg,
                late,
                visibility,
                resize,
                retakes,
                caption,
                takenAt ?? undefined, // if takenAt is defined, send it but if not, send undefined (dont sent anything)
                location ?? undefined, // same as above
            );

            return {
                done: true,
                msg: 'Post uploaded successfully',
                data: postUploaded,
            };
        } catch (error) {
            console.log('🚀 ~ file: BeFake.ts:434 ~ BeFake ~ error:', error);

            return {
                done: false,
                msg: 'Error uploading post',
                data: error,
            };
        }
    }

    // Delete your post
    async deletePost(): Promise<BeFakeResponse> {
        const response = await this._apiRequest('DELETE', 'content/posts');
        return {
            done: true,
            msg: 'Post deleted successfully',
            data: response,
        };
    }

    async deleteComment(
        postId: string,
        commentId: string,
    ): Promise<BeFakeResponse> {
        const payload = {
            postId: postId,
        };
        const data = {
            commentIds: [commentId],
        };
        const response = await this._apiRequest(
            'DELETE',
            'content/comments',
            data,
            payload,
        );
        if (response.status == !201) {
            return {
                done: false,
                msg: 'Error deleting comment',
                data: response,
            };
        }
        return {
            done: true,
            msg: 'Comment deleted successfully',
            data: response,
        };
    }

    async getUserInfo(): Promise<BeFakeResponse> {
        const response = await this._apiRequest('GET', 'person/me');
        return {
            done: true,
            msg: 'User info returned successfully',
            data: response,
        };
    }
}
