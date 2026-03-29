import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Budget } from "../types/budget";
import type { Expense } from "../types/expense";
import { createBudget, deleteBudget, getBudget, updateBudget } from "../api/budget";
import { getExpenses } from "../api/expense";

const BudgetPage = () => {
    const { logout } = useAuth();

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [form, setForm] = useState({
        limit_amount: "",
        month: "",
        year: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        limit_amount: "",
        month: "",
        year: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [budgetsData, expensesData] = await Promise.all([
                    getBudget(),
                    getExpenses(),
                ]);

                setBudgets(budgetsData);
                setExpenses(expensesData);
            } catch (err) {
                console.error("Error while fetching data", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const calculateSpent = (month: number, year: number) => {
        return expenses.filter((e) => {
            const d = new Date(e.date);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        }).reduce((sum, e) => sum + e.amount, 0);
    };

    const startEdit = (b: Budget) => {
        setEditingId(b.id);
        setEditForm({
            limit_amount: b.limit_amount.toString(),
            month: b.month.toString(),
            year: b.year.toString(),
        });
    };

    const handleUpdate = async (id: string) => {
        try {
            const updated = await updateBudget(id, {
                limit_amount: Number(editForm.limit_amount),
                month: Number(editForm.month),
                year: Number(editForm.year),
            });

            setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
            setEditingId(null);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleCreate = async (event: React.SubmitEvent) => {
        event.preventDefault();

        try {
            const newBudget = await createBudget({
                limit_amount: Number(form.limit_amount),
                month: Number(form.month),
                year: Number(form.year),
            });

            setBudgets((prev) => [newBudget, ...prev]);
            setForm({ limit_amount: "", month: "", year: "" });
        } catch (err) {
            console.error("Error while creating budget", err);
        }
    }

    const handleDelete = async (id: string) => {
        await deleteBudget(id);
        setBudgets((prev) => prev.filter((b) => b.id !== id));
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Budgets</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>

            <form onSubmit={handleCreate} className="mb-6 grid grid-cols-3 gap-4">
                <input
                    type="number"
                    placeholder="Limit"
                    value={form.limit_amount}
                    onChange={(e) =>
                        setForm({ ...form, limit_amount: e.target.value })
                    }
                    className="p-2 border rounded"
                    required
                />

                <input
                    type="number"
                    placeholder="Month (1-12)"
                    value={form.month}
                    onChange={(e) =>
                        setForm({ ...form, month: e.target.value })
                    }
                    className="p-2 border rounded"
                    required
                />

                <input
                    type="number"
                    placeholder="Year"
                    value={form.year}
                    onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                    }
                    className="p-2 border rounded"
                    required
                />

                <button className="col-span-3 bg-blue-500 text-white p-2 rounded">
                    Add Budget
                </button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : budgets.length === 0 ? (
                <p>No budgets</p>
            ) : (
                <ul className="space-y-3">
                    {budgets.map((b) => (
                        <li
                            key={b.id}
                            className="p-4 bg-white rounded shadow flex justify-between items-center"
                        >
                            {editingId === b.id ? (
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={editForm.limit_amount}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, limit_amount: e.target.value })
                                        }
                                        className="border p-1 w-20"
                                    />
                                    <input
                                        value={editForm.month}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, month: e.target.value })
                                        }
                                        className="border p-1 w-16"
                                    />
                                    <input
                                        value={editForm.year}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, year: e.target.value })
                                        }
                                        className="border p-1 w-20"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg">
                                            {b.limit_amount}
                                        </p>

                                        <p className="text-sm text-gray-500 mb-2">
                                            {b.month}/{b.year}
                                        </p>

                                        {(() => {
                                            const spent = calculateSpent(b.month, b.year);
                                            const remaining = b.limit_amount - spent;
                                            const percentage = Math.min((spent / b.limit_amount) * 100, 100);

                                            return (
                                                <>
                                                    <p className="text-sm">
                                                        Spent: {spent} / {b.limit_amount}
                                                    </p>
                                                    <p className="text-sm">
                                                        Remaining: {remaining}
                                                    </p>

                                                    <div className="w-full bg-gray-200 rounded h-2 mt-2">
                                                        <div
                                                            className={`h-2 rounded ${percentage > 80
                                                                    ? "bg-red-500"
                                                                    : percentage > 50
                                                                        ? "bg-yellow-500"
                                                                        : "bg-green-500"
                                                                }`}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </>
                            )}



                            <div className="flex gap-2">
                                {editingId === b.id ? (
                                    <button
                                        onClick={() => handleUpdate(b.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => startEdit(b)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(b.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BudgetPage;