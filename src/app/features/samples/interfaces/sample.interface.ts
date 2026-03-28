import { SampleStatus } from "../enums/sample-status.enum";

export interface Sample
{
    id: number;
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName?: string;
    orderNumber: number;
    type: string;
    status: SampleStatus;
    collectionDate?: Date;
    expiryDate?: Date;
    // officeCity: string;
    // officeNumber: number;
}