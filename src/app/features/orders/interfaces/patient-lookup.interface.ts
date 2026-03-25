export interface PatientLookup
{
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: Date;
}