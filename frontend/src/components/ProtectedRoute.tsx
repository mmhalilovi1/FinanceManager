import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if(loading) return <div>Loading...</div>;   // demo verzija

    if(!user) return <Navigate to="/login" replace/>

    return children;
};

export default ProtectedRoute;