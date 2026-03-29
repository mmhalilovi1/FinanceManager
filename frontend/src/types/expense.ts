export type ExpenseType = "PLANNED" | "EXPENSE"; 

export interface Expense {
    id?: string;
    title: string;
    description?: string;
    amount: number;
    date: string;   // backend šalje ISO string
    type: ExpenseType;
}

export interface CreateExpenseDTO {
    title: string;
    description?: string;
    amount: number;
    date: Date;
    type: ExpenseType;
    category_id: string;
}

export interface GetExpensesParams {
    sort?: string;
    order?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}