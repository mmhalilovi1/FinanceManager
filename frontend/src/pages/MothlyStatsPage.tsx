import { getMonthlyStats } from "../api/stats";
import type { Stats } from "../types/stats";
import { useEffect, useState } from "react";


const MonthlyStatsPage = () => {
    const [stats, setStats] = useState<Stats[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getMonthlyStats();
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        }   
        
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-center">
                Monthly statistics
            </h1>

            <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-2xl p-5 border border-gray-100"
                    >
                        {/* Month */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {stat.month}
                        </h2>

                        {/* Amount */}
                        <p className="text-2xl font-bold text-blue-600 mb-4">
                            {stat.amount}$
                        </p>

                        {/* Categories */}
                        <div className="space-y-2">
                            {stat.categories.map((cat, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                                >
                                    <span className="text-gray-700">
                                        {cat.category.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {cat.category.tag}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MonthlyStatsPage;