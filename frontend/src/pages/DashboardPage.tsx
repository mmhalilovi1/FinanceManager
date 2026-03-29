import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Expense, ExpenseType } from "../types/expense";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "../api/expense";
import type { Category } from "../types/category";
import { getCategories } from "../api/category";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
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

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        amount: "",
    });

    const [filters, setFilters] = useState({
        sort: "",
        order: "",
        from: "",
        to: "",
        page: 1,
        limit: 5,
    });

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const [expenseData, categoriesData] = await Promise.all([
                    getExpenses(),
                    getCategories(),
                ]);
                
                setExpenses(expenseData);
                setCategories(categoriesData);
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

    const handleDelete = async (id: string) => {
        try {
            await deleteExpense(id);
            setExpenses((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            console.error("Expense delete failed", err);
        }
    };

    const startEdit = (expense: Expense) => {
        setEditingId(expense.id!);
        setEditForm({
            title: expense.title,
            description: expense.description || "",
            amount: expense.amount.toString(),
        });
    };

    const handleUpdate = async (id: string) => {
        try {
            const updated = await updateExpense(id, {
                title: editForm.title,
                description: editForm.description,
                amount: Number(editForm.amount),
            });

            setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));

            setEditingId(null);
        } catch (err) {
            console.error("Expense update failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Welcome, {user?.username}
                </h1>

                <div className="flex justify-end gap-2">
                    <button onClick={() => navigate("/stats")} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Monthly stats
                    </button>

                    <button onClick={() => navigate("/budgets")} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Budgets
                    </button>

                    <button onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg">
                        Logout
                    </button>
                </div>
            </div>

            <div className="mb-4 flex gap-4 flex-wrap">
                <select
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                className="p-2 border rounded">
                    <option value="">Sort By</option>
                    <option value="amount">Amount</option>
                    <option value="date">Date</option>
                </select>

                <select
                value={filters.order}
                onChange={(e) => setFilters({...filters, order: e.target.value})}
                className="p-2 border rounded">
                    <option value="">Order</option>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>

                <input
                    type="date"
                    value={filters.from}
                    onChange={(e) =>
                    setFilters({ ...filters, from: e.target.value })
                    }
                    className="p-2 border rounded"
                />

                <input
                    type="date"
                    value={filters.to}
                    onChange={(e) =>
                    setFilters({ ...filters, to: e.target.value })
                    }
                    className="p-2 border rounded"
                />

                <button
                    onClick={async () => {
                        try {
                            setLoading(true);
                            const data = await getExpenses(filters);
                            setExpenses(data);
                        } catch (err) {
                            console.error("Filter failed", err);
                        } finally {
                            setLoading(false);
                        }
                    }}
                    className="bg-blue-500 text-white px-4 rounded"
                >
                    Apply
                </button>
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

                    <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="p-2 border rounded col-span-2"
                    required
                    >
                    <option value="">Select Category</option>

                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                        {cat.name}
                        </option>
                    ))}
                    </select>

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
                            className="p-4 border rounded-lg flex items-center justify-between"
                            >
                            <div className="flex-1">
                                {editingId === expense.id ? (
                                <input
                                    value={editForm.title}
                                    onChange={(e) =>
                                    setEditForm({ ...editForm, title: e.target.value })
                                    }
                                    className="border p-1 w-full mb-1"
                                />
                                ) : (
                                <p className="font-semibold">{expense.title}</p>
                                )}

                                {editingId === expense.id ? (
                                <input
                                    value={editForm.description}
                                    onChange={(e) =>
                                    setEditForm({ ...editForm, description: e.target.value })
                                    }
                                    className="border p-1 w-full"
                                />
                                ) : (
                                <p className="text-sm text-gray-500">
                                    {expense.description}
                                </p>
                                )}
                            </div>

                            <div className="w-32 text-center">
                                <p className="font-bold">{expense.amount}</p>
                                <p className="text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {expense.id && (
                                <>
                                    {editingId === expense.id ? (
                                    <button
                                        onClick={() => handleUpdate(expense.id!)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Save
                                    </button>
                                    ) : (
                                    <button
                                        onClick={() => startEdit(expense)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    )}

                                    <button
                                    onClick={() => handleDelete(expense.id!)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                    Delete
                                    </button>
                                </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                )}
            </div>  

            <div className="flex justify-between items-center mt-6">
                <button
                disabled={filters.page === 1}
                onClick={async () => {
                    const newPage = filters.page - 1;

                    setFilters((prev) => ({...prev, page: newPage}));

                    const data = await getExpenses({
                        ...filters,
                        page: newPage,
                    });
                    
                    setExpenses(data);
                }}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">
                    Previous
                </button>

                <button
                onClick={async () => {
                    const newPage = filters.page + 1;

                    setFilters((prev) => ({ ...prev, page: newPage }));

                    const data = await getExpenses({
                        ...filters,
                        page: newPage,
                    });

                    setExpenses(data);
                }}
                className="bg-gray-300 px-4 py-2 rounded">
                    Next
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;