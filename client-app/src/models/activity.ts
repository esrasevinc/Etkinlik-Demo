export interface Activity {
    id: string;
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

