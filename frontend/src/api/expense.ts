import type { CreateExpenseDTO, Expense, GetExpensesParams } from "../types/expense";
import { api } from "./axios";

export const getExpenses = async (params?: GetExpensesParams): Promise<Expense[]> => {
    const response = await api.get("/expense", {
        params,
    });

    return response.data;
}

export const createExpense = async (data: CreateExpenseDTO): Promise<Expense> => {
    const response = await api.post("/expense", data);
    return response.data;
}

export const updateExpense = async (id: string, data: Partial<CreateExpenseDTO>):
    Promise<Expense> => {
        const response = await api.patch(`/expense/${id}`, data);
        return response.data;
}

export const deleteExpense = async (id: string) => {
    await api.delete(`/expense/${id}`);
}