import { useAuth } from "../auth/AuthContext";

const DashboardPage = () => {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Welcome, {user?.username}
                </h1>

                <button onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Logout
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <p>This is your dashboard.</p>
            </div>
        </div>
    );
};

export default DashboardPage;