import { Patient } from "../interfaces/patient.interface";
import { Appointment } from "../interfaces/appointment.interface";
import { AppointmentPurpose } from "../enums/appointment-purpose.enum";
import { AppointmentStatus } from "../enums/appointment-status.enum";
import { Office } from "@core/interfaces/office.interface";
import { OfficeType } from "@core/enums/office-type";



export const appointments: Appointment[] = [
  {
    id: 1,
    visitTime: new Date(new Date().setHours(9, 0, 0)),
    patientFirstName: 'Олена',
    patientLastName: 'Коваленко',
    patientId: 3,
    status: AppointmentStatus.Completed,
    purpose: AppointmentPurpose.FirstVisit
  },
  {
    id: 2,
    visitTime: new Date(new Date().setHours(10, 30, 0)),
    patientFirstName: 'Іван',
    patientLastName: 'Петренко',
    patientMiddleName: 'Миколайович',
    patientId: 5,
    status: AppointmentStatus.Arrived,
    purpose: AppointmentPurpose.Sample
  },
  {
    id: 3,
    visitTime: new Date(new Date().setHours(12, 0, 0)),
    patientFirstName: 'Марія',
    patientLastName: 'Сидоренко',
    patientId: 7,
    status: AppointmentStatus.Pending,
    purpose: AppointmentPurpose.Results
  },
  {
    id: 4,
    visitTime: new Date(new Date().setHours(14, 15, 0)),
    patientFirstName: 'Олександр',
    patientLastName: 'Ткаченко',
    patientMiddleName: 'Васильович',
    patientId: 6,
    status: AppointmentStatus.Arrived,
    purpose: AppointmentPurpose.FirstVisit
  },
  {
    id: 5,
    visitTime: new Date(new Date().setHours(19, 45, 0)),
    patientFirstName: 'Анна',
    patientLastName: 'Мороз',
    patientId: 9,
    status: AppointmentStatus.Cancelled,
    purpose: AppointmentPurpose.Sample
  }
];

export const offices: Office[] = [
    { id: 1, number: 1, city: 'Львів',  address: 'вул. Городоцька, 34',  type: OfficeType.Mixed      },
    { id: 2, number: 2, city: 'Львів',  address: 'вул. Наукова, 7',      type: OfficeType.Collection },
    { id: 3, number: 3, city: 'Київ',   address: 'вул. Хрещатик, 15',    type: OfficeType.Mixed      },
    { id: 4, number: 4, city: 'Київ',   address: 'просп. Перемоги, 42',  type: OfficeType.Analysis   },
    { id: 5, number: 5, city: 'Харків', address: 'вул. Сумська, 21',     type: OfficeType.Collection },
    { id: 6, number: 6, city: 'Харків', address: 'вул. Пушкінська, 10',  type: OfficeType.Mixed      },
];