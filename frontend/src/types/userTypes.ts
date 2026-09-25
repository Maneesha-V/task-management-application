export interface User {
  id: string;
  name: string;
  email: string;
}
export type LoginResp = {
    success: boolean,
          message: string;
          data: {
            accessToken: string,
            user: User,
          },
}