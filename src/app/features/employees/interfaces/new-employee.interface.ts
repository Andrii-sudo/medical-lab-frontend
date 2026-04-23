export interface NewEmployee
{
    firstName: string;
    lastName: string;
    middleName?: string;  
    phone: string;
    email: string;
    password: string;
    isAdmin: boolean;
}