import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await register(form);
            setSuccess("Account created, please login");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

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
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full mb-4 p-3 border rounded-lg"
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full mb-6 p-3 border rounded-lg"
                required
            />

            <button className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
            Register
            </button>

            <p className="text-sm mt-4 text-center">
                Already have an account?{" "}
                <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => navigate("/login")}
                > Login </span>
            </p>
        </form>
        </div>
    );
};

export default RegisterPage;