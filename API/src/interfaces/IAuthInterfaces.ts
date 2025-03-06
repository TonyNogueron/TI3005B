export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    success: boolean;
    message: string;
    token: string | null;
    expiresIn: number | null;
}

