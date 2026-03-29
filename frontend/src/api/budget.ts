import { api } from "./axios"
import type { Budget } from "../types/budget";

export const getBudget = async (): Promise<Budget[]> => {
    const response = await api.get("/budget");
    return response.data;
}

export const createBudget = async (data: Omit<Budget, "id">) => {
    const response = await api.post("/budget", data);
    return response.data;
}

export const updateBudget = async (id: string, data: Partial<Omit<Budget, "id">>) => {
    const response = await api.patch(`/budget/${id}`, data);
    return response.data;
}

export const deleteBudget = async (id: string) => {
    await api.delete(`/budget/${id}`);
}