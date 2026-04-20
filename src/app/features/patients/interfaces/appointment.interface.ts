import { AppointmentStatus } from "../enums/appointment-status.enum";
import { AppointmentPurpose } from "../enums/appointment-purpose.enum";

export interface Appointment 
{
    id: number
    visitTime: string;
    status: AppointmentStatus;
    purpose: AppointmentPurpose;
    patientId: number;
    patientFirstName: string;
    patientLastName: string;
    patientPhone: string;
}