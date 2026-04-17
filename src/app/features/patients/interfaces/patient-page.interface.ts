import { Patient } from "./patient.interface";

export interface PatientPage
{
    patients: Patient[],
    pageCount: number
}