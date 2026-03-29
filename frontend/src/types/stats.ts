import type { Category } from "./category";

export interface Stats {
    month: string;
    amount: number;
    categories: {
        category: Category;
    }[];
}