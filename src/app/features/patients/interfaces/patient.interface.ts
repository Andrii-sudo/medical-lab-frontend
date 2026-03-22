export interface Patient 
{
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: Date;
    gender: string;
    phone?: string;
    email?: string;
}
