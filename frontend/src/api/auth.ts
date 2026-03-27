import type { AuthResponse, LoginDTO, RegisterDTO } from "../types/auth";
import { api } from "./axios";

export const login = async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
}

export const register = async (data: RegisterDTO) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
}

export const getMe = async (token: string) => {
    const response = await api.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}