export interface LoginDTO {
    name: string;
    password_hash: string;
}

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    userId: string;
    username: string;
}