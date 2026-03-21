import { AppointmentStatus } from "../enums/appointment-status.enum";
import { AppointmentPurpose } from "../enums/appointment-purpose.enum";

export interface Appointment 
{
    visitTime: Date;
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName?: string;
    status: AppointmentStatus;
    purpose: AppointmentPurpose;
}