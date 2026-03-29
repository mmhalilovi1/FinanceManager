import { api } from "./axios"

export const getMonthlyStats = async () => {
    const response = await  api.get("/stats/monthly");
    return response.data;
}