export interface Patient 
{
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: Date;
    phone?: string;
    email?: string;
}
