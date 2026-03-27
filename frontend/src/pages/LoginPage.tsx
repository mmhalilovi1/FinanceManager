import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        password_hash: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(form);
            navigate("/");
        } catch (err: any) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <input
                type="text"
                name="name"
                placeholder="Username"
                value={form.name}
                onChange={handleChange}
                className="w-full mb-4 p-3 border rounded-lg"
                required
            />

            <input
                type="password"
                name="password_hash"
                placeholder="Password"
                value={form.password_hash}
                onChange={handleChange}
                className="w-full mb-6 p-3 border rounded-lg"
                required
            />

            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            > Login </button>

            <p className="text-sm mt-4 text-center">
                Don't have an account?{" "}
                <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => navigate("/register")}
                > Register </span>
            </p>
        </form>
        </div>
    );
};

export default LoginPage;