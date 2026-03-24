import { AppointmentStatus } from "../enums/appointment-status.enum";
import { AppointmentPurpose } from "../enums/appointment-purpose.enum";

export interface Appointment 
{
    id: number
    visitTime: Date;
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName?: string;
    status: AppointmentStatus;
    purpose: AppointmentPurpose;
}

export interface NewAppointment 
{
    patientId: number;
    officeId: number;
    visitTime: Date;
    purpose: AppointmentPurpose;
}