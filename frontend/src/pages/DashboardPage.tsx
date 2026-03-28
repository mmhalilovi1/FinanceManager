import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Expense, ExpenseType } from "../types/expense";
import { createExpense, getExpenses } from "../api/expense";

type FormValues = {
    title: string;
    description: string;
    amount: number;
    date: string;
    type: ExpenseType;
    category_id: string;
}

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<FormValues>({
        title: "",
        description: "",
        amount: 0,
        date: "",
        type: "EXPENSE",
        category_id: "",
    });

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const data = await getExpenses();
                setExpenses(data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        }

        fetchExpenses();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreate = async (event: React.SubmitEvent) => {
        event.preventDefault();

        try {
            const newExpense = await createExpense({
                ...form,
                amount: Number(form.amount),
                date: new Date(form.date),
            });
        
            setExpenses((prev) => [newExpense, ...prev]);

            setForm({
                title: "",
                description: "",
                amount: 0,
                date: "",
                type: "EXPENSE",
                category_id: "",
            });
        } catch (err) {
            console.error("Expense creation failed", err);
        }
    };

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

            <div className="bg-white p-6 rounded-xl shadow mt-4">
                <form onSubmit={handleCreate} className="mb-6 grid grid-cols-2 gap-4">
                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />    

                    <input
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />

                    <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="p-2 border rounded"
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="PLANNED">Planned</option>
                    </select>

                    <input
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="p-2 border rounded col-span-2"
                    />

                    <input
                        name="category_id"
                        placeholder="Category ID (temporary)"
                        value={form.category_id}
                        onChange={handleChange}
                        className="p-2 border rounded col-span-2"
                        required
                    />

                    <button className="col-span-2 bg-blue-500 text-white p-2 rounded">
                        Add Expense
                    </button>
                </form>
                
                <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : expenses.length === 0 ? (
                    <p>No expenses found.</p>
                ) : (
                <ul className="space-y-3">
                    {expenses.map((expense) => (
                        <li
                            key={expense.id || expense.title + expense.date}
                            className="p-4 border rounded-lg flex justify-between"
                        >
                            <div>
                                <p className="font-semibold">{expense.title}</p>
                                <p className="text-sm text-gray-500">
                                    {expense.description}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold">{expense.amount}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;