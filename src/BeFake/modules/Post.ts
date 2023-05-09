import moment from "moment";
import BeFake from "../BeFake";
import { PostUpload } from "./PostUpload";
import axios from "axios";

export class Post {
    // BeFake object instance
    private beFake: BeFake;

    // Constructor (BeFake object instance)
    constructor(beFake: BeFake) {
        this.beFake = beFake;
    }

    // create post function
    public async createPost(
        primary: Uint8Array,
        secondary: Uint8Array,
        late: boolean,
        visibility: string = "friends",
        resize: boolean = true,
        retakes: number = 0,
        caption?: string, // caption is optional
        taken_at?: string,
        location?: [number, number]
    ): Promise<any> {
        if (!taken_at) {
            taken_at = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        } else {
            taken_at = moment(taken_at).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        }
        const postUpload = new PostUpload(
            primary,
            secondary,
            late,
            resize,
            visibility,
            retakes,
            caption
        );
        await postUpload.upload(this.beFake);
        let json_data: any = {
            isLate: late,
            retakeCounter: retakes,
            takenAt: taken_at,
            caption: caption,
            visibility: [visibility],
            backCamera: {
                bucket: "storage.bere.al",
                height: postUpload.primary_size[1],
                width: postUpload.primary_size[0],
                path: postUpload.primaryPath,
            },
            frontCamera: {
                bucket: "storage.bere.al",
                height: postUpload.secondary_size[1],
                width: postUpload.secondary_size[0],
                path: postUpload.secondaryPath,
            },
        };
        if (location) {
            json_data["location"] = {
                latitude: location[0],
                longitude: location[1],
            };
        }

        try {
            const response = await axios.post(
                "https://mobile.bereal.com/api/content/posts",
                json_data,
                {
                    headers: {
                        Authorization: `Bearer ${this.beFake.token}`,
                    },
                }
            );
            return response;
        } catch (error) {
            return error;
        }
    }
}
