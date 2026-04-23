export interface Employee
{
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;  
    phone: string;
    email: string;
    isAdmin: boolean;
}