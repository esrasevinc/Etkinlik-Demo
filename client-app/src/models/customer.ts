export interface Customer {
    id?: string;
    name: string;
    email: string;
    phone: string;
    TCNumber: string;
    address: string;
    birthDate: Date | null;
}