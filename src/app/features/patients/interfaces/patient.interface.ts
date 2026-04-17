export interface Patient 
{
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: string;
    gender: string;
    phone: string;
    email?: string;
}
