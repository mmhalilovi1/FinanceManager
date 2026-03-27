import { createContext, useContext, useEffect, useState } from "react";
import type { AuthResponse, LoginDTO, RegisterDTO } from "../types/auth";
import { getToken, removeToken, saveToken } from "../utils/token";
import { login as loginApi, register as registerApi, getMe } from "../api/auth";

interface AuthContextType {
    user: {
        userId: string;
        username: string;
    } | null;
    loading: boolean;
    login: (data: LoginDTO) => Promise<void>;
    register: (data: RegisterDTO) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthContextType["user"]>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const token = getToken();

            if(!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await getMe();
                setUser(data);
            } catch {
                removeToken();
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const login = async (data: LoginDTO) => {
        const res: AuthResponse = await loginApi(data);
        saveToken(res.accessToken);

        setUser({
            userId: res.userId,
            username: res.username,
        });
    };

    const register = async (data: RegisterDTO) => {
        await registerApi(data);
    };

    const logout = () => {
        removeToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("AuthContext not found");
    return context;
};
