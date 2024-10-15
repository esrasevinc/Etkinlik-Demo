export interface Customer {
    id?: string;
    name: string;
    email: string;
    phone: string;
    tcNumber: string;
    address: string;
    birthDate: Date | null;
}