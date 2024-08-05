export interface Activity {
    id: number;
    name: string;
    categoryId: number;
    category: string;
    date: Date | null;
    location: string;
    description: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isCancelled?: boolean;
}