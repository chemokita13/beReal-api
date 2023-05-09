export type response = {
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
