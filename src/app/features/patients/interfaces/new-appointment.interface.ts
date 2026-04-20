import { AppointmentPurpose } from "../enums/appointment-purpose.enum";

export interface NewAppointment 
{
    patientId: number;
    officeId: number;
    visitTime: string;
    visitDate: string;
    purpose: AppointmentPurpose;
}