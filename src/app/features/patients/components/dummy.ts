import { Patient } from "../interfaces/patient.interface";
import { Appointment } from "../interfaces/appointment.interface";
import { AppointmentPurpose } from "../enums/appointment-purpose.enum";
import { AppointmentStatus } from "../enums/appointment-status.enum";

export const patientList: Patient[] = [
  {
    id: 1,
    firstName: "Тетяна",
    lastName: "Шевченко",
    middleName: "Михайлівна",
    birthDate: new Date(1998, 6, 29), // Місяці в JS починаються з 0 (6 = липень)
    gender: 'Ж',
    phone: "+38 050 987 65 43",
    email: "t.shevchenko@gmail.com"
  },
  {
    id: 2,
    firstName: "Василь",
    lastName: "Мельник",
    birthDate: new Date(1972, 10, 4), // 10 = листопад
    gender: 'Ч',
    email: "v.melnyk@gmail.com"
  },
  {
    id: 3,
    firstName: "Олена",
    lastName: "Коваленко",
    middleName: "Іванівна",
    birthDate: new Date(1985, 2, 12), // 2 = березень
    gender: 'Ж',
    phone: "+38 067 123 45 67"
  },
  {
    id: 4,
    firstName: "Андрій",
    lastName: "Бойко",
    middleName: "Сергійович",
    birthDate: new Date(1960, 1, 17), // 1 = лютий
    gender: 'Ч',
    phone: "+38 063 456 78 90"
  }
];

export const appointments: Appointment[] = [
  {
    id: 1,
    visitTime: new Date(new Date().setHours(9, 0, 0)),
    patientFirstName: 'Олена',
    patientLastName: 'Коваленко',
    status: AppointmentStatus.Completed,
    purpose: AppointmentPurpose.FirstVisit
  },
  {
    id: 2,
    visitTime: new Date(new Date().setHours(10, 30, 0)),
    patientFirstName: 'Іван',
    patientLastName: 'Петренко',
    patientMiddleName: 'Миколайович',
    status: AppointmentStatus.Arrived,
    purpose: AppointmentPurpose.Sample
  },
  {
    id: 3,
    visitTime: new Date(new Date().setHours(12, 0, 0)),
    patientFirstName: 'Марія',
    patientLastName: 'Сидоренко',
    status: AppointmentStatus.Pending,
    purpose: AppointmentPurpose.Results
  },
  {
    id: 4,
    visitTime: new Date(new Date().setHours(14, 15, 0)),
    patientFirstName: 'Олександр',
    patientLastName: 'Ткаченко',
    patientMiddleName: 'Васильович',
    status: AppointmentStatus.Arrived,
    purpose: AppointmentPurpose.FirstVisit
  },
  {
    id: 5,
    visitTime: new Date(new Date().setHours(19, 45, 0)),
    patientFirstName: 'Анна',
    patientLastName: 'Мороз',
    status: AppointmentStatus.Cancelled,
    purpose: AppointmentPurpose.Sample
  }
];