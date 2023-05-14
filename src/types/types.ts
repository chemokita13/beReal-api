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

export type PostData = {
    img1: string; // Uint8Array
    img2: string; // Uint8Array
    resize?: boolean;
    late?: boolean;
    visibility: string;
    retakes?: number;
    caption?: string;
    taken_at?: string; // Date
    location?: [number, number]; // [longitude, latitude]
};
