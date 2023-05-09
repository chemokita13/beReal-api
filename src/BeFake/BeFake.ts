import axios from "axios";

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp"; // to download and resize images
import moment from "moment";
import { Post } from "./modules/Post";
import { BeFakeResponse } from "./types/BeFakeResponse";

export default class BeFake {
    // TODO: add the coresponding types
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
        refresh_token = null,
        proxies = null,
        disable_ssl = false,
        deviceId = null
        ///api_url?,
        ///google_api_key?
    ) {
        (this.disable_ssl = false),
            (this.deviceId = deviceId || this._generateRandomDeviceId()),
            (this.api_url = "https://mobile.bereal.com/api"),
            (this.google_api_key = "AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA"),
            (this.headers = {
                "user-agent":
                    "BeReal/1.0.1 (AlexisBarreyat.BeReal; build:9513; iOS 16.0.2) 1.0.0/BRApriKit",
                "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
            });
        this.dataPath = "programData";
    }

    // Generate a random device id, (random string with 16chars)
    _generateRandomDeviceId(): string {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    }

    // Only a getter for debug
    _getSelf(): any {
        return this.otpSession;
    }

    // Send a mobile verification (vonage) code to a phone number via SMS
    async sendOtpVonage(phoneNumber: string): Promise<BeFakeResponse> {
        const data = {
            phoneNumber: phoneNumber,
            deviceId: this._generateRandomDeviceId(),
        };
        const response = await axios.post(
            "https://auth.bereal.team/api/vonage/request-code",
            data,
            {
                headers: {
                    "user-agent":
                        "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
                },
            }
        );

        if (response.status == 200) {
            this.otpSession = response.data.vonageRequestId;
            return {
                done: true,
                msg: "OTP sent successfully",
            };
        } else {
            return {
                done: false,
                msg: "Something went wrong",
                data: response,
            };
        }
    }

    async saveToken(): Promise<BeFakeResponse> {
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

        try {
            // Check if the folder exists
            if (!fs.existsSync(this.dataPath)) {
                // If doesn't exist, create it
                fs.mkdirSync(this.dataPath);
            }

            // save the object to a JSON file
            await fs.writeFileSync(
                path.join(this.dataPath, "USER_INFO.json"),
                JSON.stringify(objToSave, null, 4)
            );
            return {
                done: true,
                msg: "Tokens saved successfully",
            };
        } catch (error) {
            return {
                done: false,
                msg: "Something went wrong",
                data: error,
            };
        }
    }

    async refreshToken(): Promise<void> {
        try {
            const response = await axios.post(
                "https://auth.bereal.team/token",
                {
                    grant_type: "refresh_token",
                    client_id: "ios",
                    client_secret: "962D357B-B134-4AB6-8F53-BEA2B7255420",
                    refresh_token: this.refresh_token,
                },
                {
                    params: { grant_type: "refresh_token" },
                }
            );
            this.token = response.data.access_token;
            this.expiration = moment().add(response.data.expires_in, "seconds");
            this.refreshToken = response.data.refresh_token;
        } catch (error) {
            console.log(error);
        }
    }

    // load the tokens from a JSON file
    async loadToken(): Promise<BeFakeResponse> {
        try {
            // read the file
            const data = await fs.readFileSync(
                "./programData/USER_INFO.json",
                "utf8"
            );
            // parse the JSON
            const obj = JSON.parse(data);

            // set the tokens
            this.refresh_token = obj.access.refresh_token;
            this.token = obj.access.token;
            this.expiration = moment(obj.access.expires);
            this.firebase_refresh_token = obj.firebase.refresh_token;
            this.firebaseToken = obj.firebase.token;
            this.firebaseExpiration = moment(obj.firebase.expires);
            this.userId = obj.userId;
            console.log("Loaded token successfully");
            await this.refreshToken(),
                await this.firebaseRefreshTokens(),
                await this.saveToken();
            return {
                done: true,
                msg: "Tokens loaded successfully",
            };
        } catch (error) {
            return {
                done: false,
                msg: "Something went wrong",
                data: error,
            };
        }
    }

    // Verify a mobile verification (vonage) code sent to a phone number via SMS
    async verifyOtpVonage(otpCode: string): Promise<BeFakeResponse> {
        // If there is no otpSession, exit
        if (!this.otpSession) {
            return {
                done: false,
                msg: "No otpSession",
            };
        }

        const otpVerRes = await axios.post(
            "https://auth.bereal.team/api/vonage/check-code",
            {
                vonageRequestId: this.otpSession,
                code: otpCode,
            }
        );

        // TODO: check if the response is 200 or 201
        if (otpVerRes.data.status != 0) {
            return {
                done: false,
                msg: "OTP verification failed",
                data: otpVerRes.data,
            };
        }

        try {
            const tokenRes = await axios.post(
                "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken",
                {
                    token: otpVerRes.data.token,
                    returnSecureToken: true,
                },
                {
                    params: {
                        key: this.google_api_key,
                    },
                }
            );

            // set the token
            this.firebase_refresh_token = tokenRes.data.refreshToken;

            // refresh the token
            await this.firebaseRefreshTokens();
            // grant the access token
            await this.grantAccessToken();
            // save user info (tokens, userId...)
            await this.saveToken();
            return {
                done: true,
                msg: "OTP verified successfully",
            };
        } catch (error) {
            return {
                done: false,
                msg: "Something went wrong",
                data: error,
            };
        }
    }

    // upload the token for avoid expiration
    async firebaseRefreshTokens(): Promise<any> {
        // If there is no firebase_refresh_token, exit
        if (!this.firebase_refresh_token) {
            return "No firebase_refresh_token, please login first";
        }

        try {
            const response = await axios.post(
                "https://securetoken.googleapis.com/v1/token",
                {
                    grantType: "refresh_token",
                    refreshToken: this.firebase_refresh_token,
                },
                {
                    headers: this.headers,
                    withCredentials: true,
                    params: { key: this.google_api_key },
                }
            );

            // Exception handling
            if (response.status !== 200) {
                console.log(
                    "Token refresh failed(l164), error: ",
                    response.data
                );
                return;
            }

            //!console.log(response.data.refresh_token);
            this.firebase_refresh_token = response.data.refresh_token;
            this.firebaseToken = response.data.id_token;
            this.firebaseExpiration = moment().add(
                parseInt(response.data.expires_in),
                "seconds"
            );
            this.userId = response.data.user_id;
        } catch (error) {
            return {
                done: false,
                msg: "Something went wrong",
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
            "https://auth.bereal.team/token",
            {
                grant_type: "firebase",
                client_id: "ios",
                client_secret: "962D357B-B134-4AB6-8F53-BEA2B7255420",
                token: this.firebaseToken,
            },
            {
                headers: this.headers,
                withCredentials: true,
                params: { grant_type: "firebase" },
            }
        );

        // Exception handling
        if (response.status !== 201) {
            return;
        }
        this.refresh_token = response.data.refresh_token;
        this.expiration = moment().add(
            parseInt(response.data.expires_in),
            "seconds"
        );

        this.token = await response.data.access_token;
        return;
    }

    // make all BeReal's API requests
    async _apiRequest(
        method: string,
        endpoint: string,
        data?: object,
        params?: object
    ): Promise<any> {
        const response = await axios({
            method: method,
            url: this.api_url + "/" + endpoint,
            headers: {
                Authorization: "Bearer " + this.token,
            },
            data: data,
            params: params,
        });
        return response.data;
    }

    // TODO: optimize this function (i think is done without the best way)
    async getFriendsFeed(option: number): Promise<BeFakeResponse> {
        /**
         * option:
         * 0: return data
         * 1: save JSON file with data
         * 2: create path and user folders with data and download images
         */
        const response = await this._apiRequest("GET", "feeds/friends");
        if (option < 0 || option > 3) {
            return {
                done: false,
                msg: "Invalid option",
            };
        }
        try {
            if (option == 0) {
                return {
                    done: true,
                    msg: "Data returned successfully",
                    data: response,
                };
            }
            if (option == 1) {
                await fs.writeFile(
                    path.join("programData", "friendsFeed.json"),
                    JSON.stringify(response, null, 4),
                    () => {
                        console.log("File created successfully");
                    }
                );
                return {
                    done: true,
                    msg: "File created successfully",
                };
            }
            if (option == 2) {
                const feedPath = path.join(this.dataPath, "friendsFeed");
                // Check if the folder exists
                if (!fs.existsSync(feedPath)) {
                    // If doesn't exist, create it
                    fs.mkdirSync(feedPath);
                } else {
                    // If exists, delete it and create it again
                    fs.rmSync(feedPath, { recursive: true });
                    fs.mkdirSync(feedPath);
                }
                for (let i = 0; i < response.length; i++) {
                    const friendPath = path.join(
                        feedPath,
                        response[i].userName
                    );
                    // Check if the folder exists
                    if (!fs.existsSync(friendPath)) {
                        // If doesn't exist, create it
                        await fs.mkdirSync(friendPath);
                    } else {
                        // If exists, delete it and create it again
                        fs.rmSync(friendPath, { recursive: true });
                        fs.mkdirSync(friendPath);
                    }
                    // create photos folder
                    const imagesPath = path.join(friendPath, "images");
                    if (!fs.existsSync(imagesPath)) {
                        // If doesn't exist, create it
                        fs.mkdirSync(imagesPath);
                    }
                    // Save user.json info
                    await fs.writeFile(
                        path.join(friendPath, "user.json"),
                        JSON.stringify(response[i], null, 4),
                        () => {
                            console.log(
                                "user.json created successfully",
                                response[i].userName
                            );
                        }
                    );
                    //* Save images

                    // Primary image
                    const primaryImage = await axios.get(response[i].photoURL, {
                        responseType: "arraybuffer",
                    });
                    console.log(primaryImage.data);
                    await sharp(primaryImage.data)
                        .toFormat("jpg")
                        .toFile(path.join(imagesPath, "primary.jpg"));

                    // Secondary image
                    const secondaryImage = await axios.get(
                        response[i].secondaryPhotoURL,
                        {
                            responseType: "arraybuffer",
                        }
                    );
                    await sharp(secondaryImage.data)
                        .toFormat("jpg")
                        .toFile(path.join(imagesPath, "secondary.jpg"));

                    // Profile img
                    /// if doesn't exist, continue
                    if (!response[i].user.profilePicture) continue;
                    const profileImage = await axios.get(
                        response[i].user.profilePicture.url,
                        {
                            responseType: "arraybuffer",
                        }
                    );
                    await sharp(profileImage.data)
                        .toFormat("jpg")
                        .toFile(path.join(imagesPath, "profile.jpg"));
                }
            }
            return {
                done: true,
                msg: "Data saved successfully",
            };
        } catch (error) {
            return {
                done: false,
                msg: "Error saving data",
                data: error,
            };
        }
    }

    // Get friends info
    async getFriends(option: number): Promise<BeFakeResponse> {
        /**
         * option:
         * 0: return data
         * 1: save JSON file with data
         * */
        if (option < 0 || option > 1) {
            return {
                done: false,
                msg: "Invalid option",
            };
        }
        const response = await this._apiRequest("GET", "relationships/friends");
        if (option == 0) {
            return {
                done: true,
                msg: "Data returned successfully",
                data: response,
            };
        } else {
            // check if programData folder exists
            if (!fs.existsSync("programData")) {
                // If doesn't exist, create it
                fs.mkdirSync("programData");
            }
            await fs.writeFile(
                path.join("programData", "friends.json"),
                JSON.stringify(response, null, 4),
                () => {
                    console.log("File created successfully");
                }
            );
            return {
                done: true,
                msg: "File created successfully",
            };
        }
    }

    // Comment a post
    async commentPost(
        postId: string,
        comment: string
    ): Promise<BeFakeResponse> {
        // Prepare the data to send in the request
        const payload = {
            postId: postId,
        };
        const data = {
            content: comment,
        };
        const response = await this._apiRequest(
            "POST",
            "content/comments",
            data,
            payload
        );
        return {
            done: true,
            msg: "Comment posted successfully",
            data: response,
        };
    }

    // Get friend suggestions
    async getFriendSuggestions(page?: number): Promise<BeFakeResponse> {
        const response = await this._apiRequest(
            "GET",
            "relationships/suggestions",
            {}, // data empty
            page ? { page: page } : {} // if page is defined, send it
        );
        return {
            done: true,
            msg: "Friend suggestions returned successfully",
            data: response,
        };
    }

    // Post a photo
    async postUpload(
        primary: Uint8Array,
        secondary: Uint8Array,
        resize: boolean = true,
        late: boolean = true,
        visibility: string = "friends",
        retakes: number = 0,
        caption: string = "",
        takenAt?: string,
        location?: [number, number]
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
                location ?? undefined // same as above
            );

            return {
                done: true,
                msg: "Post uploaded successfully",
                data: postUploaded,
            };
        } catch (error) {
            return {
                done: false,
                msg: "Error uploading post",
                data: error,
            };
        }
    }

    // Delete your post
    async deletePost(): Promise<BeFakeResponse> {
        const response = await this._apiRequest("DELETE", "content/posts");
        return {
            done: true,
            msg: "Post deleted successfully",
            data: response,
        };
    }
}
